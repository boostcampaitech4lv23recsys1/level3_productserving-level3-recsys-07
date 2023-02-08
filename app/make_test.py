import pandas as pd
import pickle

def make_testfile(data:list):
    test = pd.DataFrame()
    test['item'] = data
    test['uid'] = 0

    test = test[['uid','item']]
    test = test.rename(columns = {'item':'sid'})
    with open('../data/show2id_multivae.pickle', 'rb') as fr:
        aa = pickle.load(fr)

    ee = test['sid'].apply(lambda x: aa[x])
    test['sid'] = ee
    return test

def make_testfile_lgbm():

    feat = ['tempo_mean', 'zero_crossings_var', 'zero_crossings_mean',
       'y_harm_var', 'y_harm_mean', 'y_perc_var', 'y_perc_mean',
       'spectral_centroids_var', 'spectral_centroids_mean',
       'spectral_rolloff_var', 'spectral_rolloff_mean', 'mfccs_var',
       'mfccs_mean', 'chromagram_var', 'chromagram_mean']

    test = pd.read_csv('../data/song_feature_af.csv')
    # test에 노래 인덱스 붙여줘야됨
    return test[feat]