# Git-today

Get some fun stats on your code slinging activity.

## Installation

```
npm -g install git-today
```

## Usage

By default `git-today` will search for commits from the author specified in `.gitconfig` for commits in the current directory and spit out a report:

```
git-today
```

Will output:

```
Git stats for last 1 day in ./:
  17 files modified
  220 line insertions
  682 line deleitions
 =======================
  -462 net lines
```


## Options

### -a / --author

Specify a different author

```
git-today -a "Some dude"
```

### -d / --directories

Runs an aggregate report for multiple directories.

```
git-today -d ~/Dev/node/kongo,~/Dev/node/agenda
```

```
Git stats for last 1 day in all directories specified:
  7 files modified
    11 line insertions
      0 line deleitions
       =======================
         -1 net lines
```

### -m / --multi

Used in conjunction with `-d`. Specifies to print each report for the directories instead of one aggregate report

### -t / --time

Time duration to search within. By default, `1 day`. Takes any [humanInterval](https://github.com/rschmukler/humanInterval)
