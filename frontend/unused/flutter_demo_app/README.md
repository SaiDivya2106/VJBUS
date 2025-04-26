# flutter_demo_app

A new Flutter project.

## Getting Started

This project is a starting point for a Flutter application.

A few resources to get you started if this is your first Flutter project:

- [Lab: Write your first Flutter app](https://docs.flutter.dev/get-started/codelab)
- [Cookbook: Useful Flutter samples](https://docs.flutter.dev/cookbook)

For help getting started with Flutter development, view the
[online documentation](https://docs.flutter.dev/), which offers tutorials,
samples, guidance on mobile development, and a full API reference.

# Flutter Setup

sudo apt update


sudo apt install curl git unzip xz-utils zip libglu1-mesa clang cmake ninja-build pkg-config libgtk-3-de

curl -O https://storage.googleapis.com/flutter_infra_release/releases/stable/linux/flutter_linux_3.19.1-stable.tar.xz

tar xf flutter_linux_3.19.1-stable.tar.xz
sudo mv flutter /opt/flutter


echo 'export PATH="$PATH:/opt/flutter/bin"' >> ~/.bashrc
flutter doctor
flutter --version



# How the app was created (need not be done ever)
flutter create flutter_demo_app

or 
Git Clone this Repo

# How to Run 
cd flutter_demo_app

flutter pub add http

flutter run -d chrome --web-browser-flag="--disable-web-security"
