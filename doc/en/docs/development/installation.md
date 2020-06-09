---
title: Download and installation of Otletosphere software
author: Guillaume Brioudes <https://myllaume.fr/>
date: 09/06/2020
---

Downloading and installing the Otletosphere softwarea The following instructions are for downloading and installing the software that runs the Otletosphere for use in your own project. First you will find the instructions for downloading the various packages, then additional explanations for installing the development tools and making [editing the project]() easier.

To change the [software database]() or its [operation](), please follow the other tutorials.

## Download

The latest tested version of the source code is stored on a [GitHub repository](https://github.com/hyperotlet/otletosphere). There are two installation methods.

### By command

Once in the desired location, you can download the content using the following command line if you have [Git software](https://git-scm.com/) installed.

```bash
$ git clone https://github.com/hyperotlet/otletosphere.git
```

### By zip file

![Installation by GitHub download](../images/installation download github.jpg)

You can also go to the [GitHub repository](https://github.com/hyperotlet/otletosphere) and click the *Clone or download* button and then click *Download ZIP*. You can then simply unzip the downloaded archive and place it in the location of your choice:

- [unzip an archive on Windows](https://support.microsoft.com/en-us/help/14200/windows-compress-uncompress-zip-files)
- [unzip an archive on macOS](https://support.apple.com/guide/mac-help/compress-uncompress-files-folders-mac-mchlp2528/mac)

## Gulp.js

[Gulp.js](https://gulpjs.com/) is a Node.js module that works well with command boxes (*Windows Command Prompt* and MacOS Terminal*). Here is a complete installation tutorial on the subject: https://www.alsacreations.com/tuto/lire/1686-introduction-a-gulp.html

The `package.json` file contains all the necessary dependencies, and the `gulpfile.js` contains the appropriate configuration for the environment.

To install the dependencies you can execute the following command:

```bash
npm install
```

### Commandes

The following command allows you to start processing the `.scss` and `.js` files respectively from [directories]() `/sass` and `/scripts` to `/assets/main.css` and `/assets/main.js`.

```bash
gulp watch
```

Each time a `.scss` or `.js` file is saved to the `/sass` or `/scripts` locations, Gulp.js compiles the files.