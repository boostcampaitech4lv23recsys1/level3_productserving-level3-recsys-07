import json
import pandas as pd

def change_data(x):
    idlist = []
    songlist = []
    x = x[['id','songs']]
    for _, song in x.iterrows():
        idlist += ([song.values[0]]*len(song.values[1]))
        songlist += song.values[1]
        
    df = pd.DataFrame()
    df['user'] = idlist
    df['item'] = songlist
    
    return df

train = pd.read_json('/opt/ml/final project/data/original/train.json')
val = pd.read_json('/opt/ml/final project/data/original/val.json')
test = pd.read_json('/opt/ml/final project/data/original/test.json')

change_train = change_data(train)
change_train.to_csv('/opt/ml/final project/data/worked/change_train.csv')

change_val = change_data(val)
change_val.to_csv('/opt/ml/final project/data/worked/change_val.csv')

change_test = change_data(test)
change_test.to_csv('/opt/ml/final project/data/worked/change_test.csv')