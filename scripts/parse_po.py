import argparse
import re
import csv
import os
import sys
import io
from backports import csv


def main():
    parser = argparse.ArgumentParser(description='Parse a .po file')
    parser.add_argument('infilepath', help='the filepath to the .po or .csv file')
    parser.add_argument(
        '--newOrFuzzy',
        action='store_true',
        dest='only_new_or_fuzzy',
        help='Export only new and fuzzy translations to .csv file'
    )
    args = parser.parse_args()
    basedir, filename = os.path.split(args.infilepath)
    match = re.search('(.*)(\.po|\.csv)$', filename)
    if '.po' in args.infilepath:
        po_to_csv(args, basedir, match.group(1))
    elif '.csv' in args.infilepath:
        csv_to_po(args.infilepath, basedir, match.group(1))
    else:
        print 'You must provide either a .po file or a .csv file.  Exiting'
        sys.exit()


def csv_to_po(infilepath, basedir, basefile):
    outfilepath = os.path.join(basedir, basefile + '.po')
    with io.open(infilepath, 'r', encoding='utf-8-sig') as fh:
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
                pofile.write('msgid "{}"\n'.format(row[0].encode('utf-8')))
                # If the second column has a value, it's a plurlalized translations
                if len(row[1]) > 0:
                    pofile.write('msgid_plural "{}"\n'.format(row[1].encode('utf-8')))
                    pofile.write('msgstr[0] "{}"\n'.format(row[3].encode('utf-8')))
                    pofile.write('msgstr[1] "{}"\n'.format(row[4].encode('utf-8')))
                else:
                    pofile.write('msgstr "{}"\n'.format(row[2].encode('utf-8')))
                pofile.write('\n')


def po_to_csv(args, basedir, basefile):
    outfilepath = os.path.join(basedir, basefile + '.csv')
    with io.open(args.infilepath, 'r', encoding='utf-8-sig') as infile:
        contents = infile.read()

    stanzas = contents.split('\n\n')

    with io.open(outfilepath, 'w', encoding='utf-8-sig') as csvfile:
        csv_writer = csv.writer(csvfile, quoting=csv.QUOTE_MINIMAL)
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
            # Skip output of translated strings if only new and fuzzy are to be exported
            if args.only_new_or_fuzzy and not is_untranslated(stanza) and not 'fuzzy' in stanza:
                continue
            components = stanza_to_components(stanza)
            # stanza_to_components could will return None if the whole stanza is a component
            if components:
                csv_writer.writerow([
                    components['msgid'],
                    components['msgid_plural'],
                    components['msgstr'],
                    components['msgstr[0]'],
                    components['msgstr[1]'],
                    components['similar'],
                    components['note']
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
        line = line
        if 'msgid_plural' in line:
            # if this line begins with "#", the whole thing is an old (commented) translation and should be skipped.
            if re.search('^#', line):
                return None
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
            # if this line begins with "#", the whole thing is an old (commented) translation and should be skipped.
            if re.search('^#', line):
                return None
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
