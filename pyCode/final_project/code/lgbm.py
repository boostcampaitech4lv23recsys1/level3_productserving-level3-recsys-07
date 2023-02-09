import pandas as pd
import random
import numpy as np
import lightgbm as lgb
from sklearn.metrics import roc_auc_score
from sklearn.metrics import accuracy_score
import sklearn
from sklearn.preprocessing import MinMaxScaler
from tqdm import tqdm
import joblib

song_meta_df = pd.read_csv('/opt/ml/song_feat_final.csv')
song_meta_df = song_meta_df.drop(columns=['tempo_var'])
song_meta_df['item'] = song_meta_df.index.tolist()

item = song_meta_df['item'].tolist()

input = random.sample(item,5)  ####이 부분을 db에 있는 train을 가져오면 됩니다.

df = pd.DataFrame()
df['item'] = input
df['user'] = 0
df['rating'] = 1

users = set(df.loc[:, 'user'])
items = set(song_meta_df.loc[:, 'item'])

# 3. Negative instance 생성
print("Create Nagetive instances")
num_negative = 500
user_group_dfs = list(df.groupby('user')['item'])
first_row = True
user_neg_dfs = pd.DataFrame()

for u, u_items in tqdm(user_group_dfs):
    u_items = set(u_items)
    i_user_neg_item = np.random.choice(list(items - u_items), num_negative, replace=False)
    
    i_user_neg_df = pd.DataFrame({'user': [u]*num_negative, 'item': i_user_neg_item, 'rating': [0]*num_negative})
    if first_row == True:
        user_neg_dfs = i_user_neg_df
        first_row = False
    else:
        user_neg_dfs = pd.concat([user_neg_dfs, i_user_neg_df], axis = 0, sort=False)

df = pd.concat([df, user_neg_dfs], axis = 0, sort=False)

df = df[['user','item','rating']]

scaler = MinMaxScaler()
for col in song_meta_df.columns:
    if not col in ['user', 'item', 'orginal_song_id']:
        song_meta_df[col] = scaler.fit_transform(song_meta_df[[col]])

X = pd.DataFrame(song_meta_df, columns=song_meta_df.columns)

df2 = pd.merge(df, X, how='left', on='item')

random.seed(42)
def custom_train_test_split(df, ratio=0.7, split=True):
    
    users = list(df.index)
    random.shuffle(users)
    
    max_train_data_len = int(ratio*len(df))

    train_index = users[:max_train_data_len]
    test_index = users[max_train_data_len:]


    train = df.iloc[train_index]
    test = df.iloc[test_index]

    return train, test

train, test = custom_train_test_split(df2)

# X, y 값 분리
y_train = train['rating']
train = train.drop(['rating'], axis=1)

y_test = test['rating']
test = test.drop(['rating'], axis=1)

feat = ['tempo_mean', 'zero_crossings_var', 'zero_crossings_mean',
       'y_harm_var', 'y_harm_mean', 'y_perc_var', 'y_perc_mean',
       'spectral_centroids_var', 'spectral_centroids_mean',
       'spectral_rolloff_var', 'spectral_rolloff_mean', 'mfccs_var',
       'mfccs_mean', 'chromagram_var', 'chromagram_mean']

lgb_train = lgb.Dataset(train[feat], y_train)
lgb_test = lgb.Dataset(test[feat], y_test)

model = lgb.train(
    {'objective': 'regression'}, 
    lgb_train,
    valid_sets=[lgb_train, lgb_test],
    verbose_eval=100,
    num_boost_round=500,
    early_stopping_rounds=100
)

preds = model.predict(test[feat])
acc = accuracy_score(y_test, np.where(preds >= 0.5, 1, 0))
auc = roc_auc_score(y_test, preds)

print(f'VALID AUC : {auc} ACC : {acc}\n')

joblib.dump(model, 'lgb.pkl')
load_model = joblib.load('lgb.pkl')

total_preds = model.predict(song_meta_df[feat])

submission = pd.DataFrame()

submission['item'] = song_meta_df['item']
submission['song_id'] = song_meta_df['orginal_song_id']
submission['pred'] = total_preds
submission = submission[~submission['item'].isin(df2['item'].tolist())]
submission = submission.sort_values('pred', ascending=False)[:10]
submission = submission.reset_index(drop=True)
lgbm_result = submission['song_id'].tolist()
submission.to_csv('submission_lgbm.csv')