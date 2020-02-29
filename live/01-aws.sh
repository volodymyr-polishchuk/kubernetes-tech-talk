#!/bin/bash

aws configure

aws eks --region="us-east-1" update-kubeconfig --name "<cluster name>"

