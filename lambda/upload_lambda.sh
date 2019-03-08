zip ./lex_dining_suggest.zip ./lex_dining_suggest.py
aws lambda update-function-code --function-name lex_dining_suggest python36 --zip-file ./lex_dining_suggest.zip
