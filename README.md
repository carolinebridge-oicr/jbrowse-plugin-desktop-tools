# jbrowse-plugin-desktop-tools

> A plugin that can run command line tools to prepare data for JBrowse 2.

**NOTE:**

**This plugin can only be run with the desktop distribution of JBrowse 2.**

## Install

### Prerequisites

Ensure you have [JBrowse desktop](https://jbrowse.org/jb2/download/) installed.

Ensure you have [bcftools](http://www.htslib.org/) installed (`brew install bcftools` or `sudo apt install bcftools`).

Ensure you have [tabix](http://www.htslib.org/) installed (`brew install htslib` or `sudo apt install htslib`).

### Locally

Clone the git repo, yarn, and start:

```
git clone https://github.com/GMOD/jbrowse-plugin-desktop-tools.git
cd jbrowse-plugin-desktop-tools
yarn
yarn start
```

Add to the "plugins" of your JBrowse config (your `.jbrowse` file):

```json
  "plugins": [
    {
      "name": "DesktopTools",
      "url": "http://localhost:9000/dist/jbrowse-plugin-desktop-tools.umd.development.js"
    }
  ],
```

**or** navigate to the Plugin Store within JBrowse desktop and click the "Add Custom Plugin" button at the top of the store.

Then enter in the same information as highlighted in the codeblock above.

## Usage

This plugin adds a new add track workflow.

1. Navigate: Add > Linear genome view > Open > Open track selector > + icon button > Add track

2. In the topmost dropdown menu select "Unindexed variant track".

3. Choose a local `.vcf` file to process

4. Change the name if relevant

5. Press "submit" and your VCF file will have been sorted, indexed, and zipped for usage within JBrowse

If your `.vcf` file fails to process, ensure you have all necessary prerequisites and try again.
