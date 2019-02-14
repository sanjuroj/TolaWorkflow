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
    match = re.search('(.*)(\.po|\.csv)$', filename)
    if '.po' in args.infilepath:
        po_to_csv(args.infilepath, basedir, match.group(1))
    elif '.csv' in args.infilepath:
        csv_to_po(args.infilepath, basedir, match.group(1))
    else:
        print 'You must provide either a .po file or a .csv file.  Exiting'
        sys.exit()


def csv_to_po(infilepath, basedir, basefile):
    outfilepath = os.path.join(basedir, basefile + '.po')
    with open(infilepath, 'r') as fh:
        with open(outfilepath, 'w') as pofile:
            pofile.write(
                '''
msgid ""
msgstr ""
"Project-Id-Version: \\n"
"Report-Msgid-Bugs-To: \\n"
"POT-Creation-Date: 2018-12-24 11:25-0800\\n"
"PO-Revision-Date: 2018-12-20 13:56-0800\\n"
"Last-Translator: \\n"
"Language-Team: \\n"
"Language: fr\\n"
"MIME-Version: 1.0\\n"
"Content-Type: text/plain; charset=UTF-8\\n"
"Content-Transfer-Encoding: 8bit\\n"
"Plural-Forms: nplurals=2; plural=(n > 1);\\n"
"X-Generator: Poedit 2.2\\n"
'''

            )
            pofile.write('\n')
            csvreader = csv.reader(fh)
            for row in csvreader:
                if row[1] == 'English - Plural':
                    continue
                pofile.write('msgid "{}"\n'.format(row[0]))
                # If the second column has a value, it's a plurlalized translations
                if len(row[1]) > 0:
                    pofile.write('msgid_plural "{}"\n'.format(row[1]))
                    pofile.write('msgstr[0] "{}"\n'.format(row[3]))
                    pofile.write('msgstr[1] "{}"\n'.format(row[4]))
                else:
                    pofile.write('msgstr "{}"\n'.format(row[2]))
                pofile.write('\n')


def po_to_csv(infilepath, basedir, basefile):
    outfilepath = os.path.join(basedir, basefile + '.csv')
    with open(infilepath, 'r') as infile:
        contents = infile.read()

    stanzas = contents.split('\n\n')

    with open(outfilepath, 'w') as csvfile:
        csv_writer = csv.writer(csvfile, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
        csv_writer.writerow([
            'English',
            'English - Plural',
            'Translation - No Plural',
            'Translation - Singluar',
            'Translation - Plural',
            'Similar to',
            'Note to Translator',
        ])
        # skip the first one, it's housekeeping
        for i in range(1, len(stanzas)):
            stanza = stanzas[i]
            # print 'stanza', stanza
            # Some lines can be fuzzy and untranslated, need to do unstranslated first
            if is_untranslated(stanza) or 'fuzzy' in stanza:
                components = stanza_to_components(stanza)
                csv_writer.writerow([
                    components['msgid'].encode('utf8'),
                    components['msgid_plural'].encode('utf8'),
                    components['msgstr'].encode('utf8'),
                    components['msgstr[0]'].encode('utf8'),
                    components['msgstr[1]'].encode('utf8'),
                    components['similar'].encode('utf8'),
                    components['note'].encode('utf8')
                ])


def strip_quotes(target):
    match = re.search('[^\"]*\"(.+)\"[^\"]*', target)
    if match:
        return match.group(1)
    else:
        return None


def stanza_to_components(stanza):
    lines = stanza.split('\n')
    components = {
        'similar': '',
        'msgid': '',
        'msgid_plural': "",
        'msgstr[0]': "",
        'msgstr[1]': "",
        'msgstr': '',
        'note': '',
    }

    current_componenet = ''
    for line in lines:
        print 'liineee', line
        line = line.decode('utf8')
        if 'msgid_plural' in line:
            current_componenet = 'msgid_plural'
            if not re.search('^msgid_plural ""', line):
                components[current_componenet] += strip_quotes(line)
        elif 'msgstr[0]' in line:
            current_componenet = 'msgstr[0]'
            if not re.search('^msgstr\[0\] ""', line):
                components[current_componenet] += strip_quotes(line)
        elif 'msgstr[1]' in line:
            current_componenet = 'msgstr[1]'
            if not re.search('^msgstr\[1\] ""', line):
                components[current_componenet] += strip_quotes(line)
        elif '#:' in line or '#,' in line:
            continue
        elif '#|' in line:
            current_componenet = 'similar'
            components[current_componenet] += line
        elif '#.' in line:
            current_componenet = 'note'
            components[current_componenet] += line
        elif re.search('^msgid', line):
            current_componenet = 'msgid'
            if not re.search('^msgid ""', line):
                components[current_componenet] += strip_quotes(line)
        elif re.search('^msgstr', line):
            current_componenet = 'msgstr'
            if not re.search('^msgstr ""', line):
                components[current_componenet] += strip_quotes(line)
        else:
            if current_componenet != '':
                components[current_componenet] += strip_quotes(line)

    return components


def is_untranslated(stanza):
    # print '-----', stanza, '========'
    lines = stanza.split('\n')
    for i, line in enumerate(lines):
        if 'msgstr' in line:
            # print 'msgstrline', line
            # print 'i={}, len lines={}'.format(i, len(lines))
            if (line == 'msgstr ""' and len(lines) == i+1) or \
                    (line == 'msgstr ""' and len(lines[i+1]) == 0):
                return True
            else:
                return False


if __name__ == '__main__':
    main()
