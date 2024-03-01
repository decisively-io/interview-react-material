# !/bin/bash

if [ "$1" == "remove" ];
then
  echo "Unlinking packages..."
  yarn unlink @decisively-io/interview-sdk
  yarn remove @decisively-io/interview-sdk
  yarn add @decisively-io/interview-sdk
  exit 0
else
  echo "Linking packages..."
  yarn link @decisively-io/interview-sdk
  exit 0
fi