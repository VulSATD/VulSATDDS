# VulSATDData replication package

This repository contains the code to recreate the dataset presented in the paper "VulSATDData: a dataset for vulnerabilities and self-admitted technical debt".

## Requirements

We built the dataset using Python 3.10, NodeJS 18.16.0, and srcML must also be installed. Given the size of the repositories, at least 100GB of free disk space are needed.

## How to build the dataset

The first step is to clone the repository locally with the following commands:

```
git clone https://github.com/VulSATD/VulSATDDS
cd VulSATDDS
```

We recommend the creation of a virtual environment, for example, using venv (the exact commands might need to be adapted according to your system):

```
python3 -m venv env
source env/bin/activate
```

Then, install the dependencies which are listed in the requirements.txt file. This can be done using `pip`:

```
pip install -r extending-datasets/requirements.txt
```

## How to annotate and extend the datasets

And then follow the instructions for [extending the dataset](extending-datasets/README.md) or the [annotation with WeakSATD](weaksatd-annotation/README.md).