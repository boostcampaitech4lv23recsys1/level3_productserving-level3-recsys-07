import pandas as pd
import pickle

test = pd.read_csv('../data/worked/vae/test_example.csv')

test['uid'] = 0

test = test[['uid','item']]
test = test.rename(columns = {'item':'sid'})
with open('../data/worked/vae/show2id_multivae.pickle', 'rb') as fr:
    aa = pickle.load(fr)

ee = test['sid'].apply(lambda x: aa[x])
test['sid'] = ee

test.to_csv('../data/worked/vae/test.csv')

print('make_test 완료')