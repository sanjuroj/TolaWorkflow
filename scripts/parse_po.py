import argparse
import re
import csv
import os
import sys


def main():
    parser = argparse.ArgumentParser(description='Parse a .po file')
    parser.add_argument('infilepath', help='the filepath to the .po file')
    args = parser.parse_args()
    basedir, filename = os.path.split(args.infilepath)
    match = re.search('(.*).po|.csv$', filename)
    if '.po' in args.infilepath:
        po_to_csv(args.infilepath, basedir, match.group(1))
    else:
        print 'You must provide either a .po file or a .csv file.  Exiting'
        sys.exit()


def po_to_csv(infilepath, basedir, basefile):
    print infilepath, basedir, basefile
    outfilepath = os.path.join(basedir, basefile + '.csv')
    with open(infilepath, 'r') as infile:
        contents = infile.read()

    stanzas = contents.split('\n\n')

    with open(outfilepath, 'w') as csvfile:
        csv_writer = csv.writer(csvfile, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
    # skip the first one, it's housekeeping
        for i in range(1, 130):
            stanza = stanzas[i]
            if 'fuzzy' in stanza:
                lines = stanza.split('\n')
                components = {
                    'similar': '',
                    'msgid': '',
                    'msgstr': '',
                    'note': '',
                }
                for line in lines:
                    line = line.decode('utf8')
                    print line
                    if '#|' in line:
                        components['similar'] += line
                    if '#.' in line:
                        components['note'] += line
                    if re.search('^msgid', line):
                        if not re.search('^msgid ""', line):
                            components['msgid'] += strip_quotes(line)
                    if re.search('^msgstr', line):
                        if not re.search('^msgstr ""', line):
                            components['msgstr'] += strip_quotes(line)

                csv_writer.writerow([
                    components['msgid'].encode('utf8'),
                    components['msgstr'].encode('utf8'),
                    components['similar'].encode('utf8'),
                    components['note'].encode('utf8')
                ])


def strip_quotes(target):
    match = re.search('[^\"]*\"(.+)\"[^\"]*', target)
    if match:
        return match.group(1)
    else:
        return None


if __name__ == '__main__':
    main()
