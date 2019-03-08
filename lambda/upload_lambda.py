import zipfile


def upload(filename):
    with zipfile.ZipFile(filename + '.zip', 'w') as f:
        f.write(filename + '.py')


if __name__ == '__main__':
    files = ['lex_dining_suggest', 'lex_template']
    

