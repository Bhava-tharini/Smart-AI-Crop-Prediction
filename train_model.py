import os
import sys
import json
import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras import callbacks

# Paths
TRAIN_DIR = "dataset/train"
TEST_DIR = "dataset/test"
MODEL_DIR = "model"
MODEL_PATH = os.path.join(MODEL_DIR, "crop_disease_model.h5")
CLASS_NAMES_PATH = os.path.join(MODEL_DIR, "class_names.json")

# Image size & batch
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 10


def ensure_dir(path):
    os.makedirs(path, exist_ok=True)


def exit_err(msg, code=1):
    print("Error:", msg)
    sys.exit(code)


if not os.path.exists(TRAIN_DIR):
    exit_err(f"Training directory not found: {TRAIN_DIR}")
if not os.path.exists(TEST_DIR):
    exit_err(f"Test/validation directory not found: {TEST_DIR}")

print("Loading datasets with tf.data...")
try:
    train_ds = tf.keras.utils.image_dataset_from_directory(
        TRAIN_DIR,
        labels='inferred',
        label_mode='categorical',
        image_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        shuffle=True,
        seed=123
    )
except Exception as e:
    exit_err(f"Failed to load training dataset: {e}")

try:
    val_ds = tf.keras.utils.image_dataset_from_directory(
        TEST_DIR,
        labels='inferred',
        label_mode='categorical',
        image_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        shuffle=False
    )
except Exception as e:
    exit_err(f"Failed to load validation dataset: {e}")

class_names = train_ds.class_names
num_classes = len(class_names)
print(f"Found {num_classes} classes: {class_names}")

# Performance: caching, prefetching, autotune
AUTOTUNE = tf.data.AUTOTUNE
train_ds = train_ds.map(lambda x, y: (x / 255.0, y)).cache().prefetch(buffer_size=AUTOTUNE)
val_ds = val_ds.map(lambda x, y: (x / 255.0, y)).cache().prefetch(buffer_size=AUTOTUNE)

print("Building model (MobileNetV2 base)...")
base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(IMG_SIZE[0], IMG_SIZE[1], 3))
base_model.trainable = False

inputs = base_model.input
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(128, activation='relu')(x)
outputs = Dense(num_classes, activation='softmax')(x)
model = Model(inputs=inputs, outputs=outputs)

model.compile(
    optimizer=Adam(learning_rate=1e-3),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

ensure_dir(MODEL_DIR)

cb_list = [
    callbacks.ModelCheckpoint(MODEL_PATH, save_best_only=True, monitor='val_loss'),
    callbacks.EarlyStopping(monitor='val_loss', patience=3, restore_best_weights=True)
]

print("Starting training...")
history = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=EPOCHS,
    callbacks=cb_list
)

print("Saving class names and final model...")
try:
    with open(CLASS_NAMES_PATH, 'w') as f:
        json.dump(class_names, f)
    model.save(MODEL_PATH)
    print(f"Model and class names saved to '{MODEL_DIR}'")
except Exception as e:
    exit_err(f"Failed to save model or class names: {e}")
