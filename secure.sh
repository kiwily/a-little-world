#!/bin/bash
echo "Secure environment"
{
  sudo lsof -t -i :3000 | xargs sudo kill -9
  echo "Killed :3000"
} || {
  echo "Error while killing :3000"
}
echo "Done"
