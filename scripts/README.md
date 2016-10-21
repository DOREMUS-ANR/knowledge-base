Scripts
========

Scripts to run after vocabulary generation through OpenRefine.

Each command should be run pointing to the `scripts` folder.

    cd scripts/

## Installation

Latest version of Node.JS is required.

    npm install

## Commands

### vocabularies

AIBM/IAML Medium of performance

    node mop-iaml-post-script

AIBM/IAML Genre

    node genre-aibm-post-script

Mode

    node mode-post-script

### collections

Collections should be located in the `raw-data` folder in `tsv` format.

RAMEAU Medium of performance

    node rameau-mop-script

RAMEAU Ethnic groups

    node rameau-groups-script
