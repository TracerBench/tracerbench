#!/usr/bin/env Rscript
source('results.R')

argv = commandArgs(trailingOnly=TRUE)
json_filename <- if (length(argv) > 0) argv[1] else 'results.json'

print(results_json(json_filename))
