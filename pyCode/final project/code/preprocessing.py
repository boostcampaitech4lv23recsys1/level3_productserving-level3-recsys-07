import pandas as pd
import numpy as np
import os
import pickle
import argparse

parser = argparse.ArgumentParser()

parser.add_argument('--model', default='multivae', type=str)
parser.add_argument('--data', type=str, default='../data/worked/')
args = parser.parse_args()

if args.model == 'multivae':

    def get_count(tp, id):
        playcount_groupbyid = tp[[id]].groupby(id, as_index=False)
        count = playcount_groupbyid.size()

        return count

    def filter_triplets(tp, min_uc=0, min_sc=0):
        if min_sc > 0:
            itemcount = get_count(tp, 'item')
            tp = tp[tp['item'].isin(itemcount.index[itemcount >= min_sc])]

        if min_uc > 0:
            usercount = get_count(tp, 'user')
            tp = tp[tp['user'].isin(usercount.index[usercount >= min_uc])]

        usercount, itemcount = get_count(tp, 'user'), get_count(tp, 'item')
        return tp, usercount, itemcount

    def split_train_test_proportion(data, test_prop=0.2):
        data_grouped_by_user = data.groupby('user')
        tr_list, te_list = list(), list()

        np.random.seed(98765)
        
        for _, group in data_grouped_by_user:
            n_items_u = len(group)
            
            if n_items_u >= 5:
                idx = np.zeros(n_items_u, dtype='bool')
                idx[np.random.choice(n_items_u, size=int(test_prop * n_items_u), replace=False).astype('int64')] = True

                tr_list.append(group[np.logical_not(idx)])
                te_list.append(group[idx])
            
            else:
                tr_list.append(group)
        
        data_tr = pd.concat(tr_list)
        data_te = pd.concat(te_list)

        return data_tr, data_te

    def numerize(tp, profile2id, show2id):
        uid = tp['user'].apply(lambda x: profile2id[x])
        sid = tp['item'].apply(lambda x: show2id[x])
        return pd.DataFrame(data={'uid': uid, 'sid': sid}, columns=['uid', 'sid'])

    DATA_DIR = args.data
    raw_data = pd.read_csv('/opt/ml/final project/data/worked/change_train.csv')
#../data/worked/change_train.csv
# /opt/ml/final project/data/original/train.csv
#/opt/ml/cnn/train_top10 copy.csv
    raw_data, user_activity, item_popularity = filter_triplets(raw_data, min_uc=5, min_sc=0)

    unique_uid = user_activity.index

    np.random.seed(98765)
    idx_perm = np.random.permutation(unique_uid.size)
    unique_uid = unique_uid[idx_perm]

    n_users = unique_uid.size 
    n_heldout_users = int(n_users * 0.1)

    tr_users = unique_uid[:(n_users - n_heldout_users)]
    vd_users = unique_uid[(n_users - n_heldout_users):]

    train_plays = raw_data.loc[raw_data['user'].isin(tr_users)]

    song_df = pd.read_json('/opt/ml/song_meta.json')

    unique_sid = pd.unique(song_df['id'])

    show2id = dict((sid, i) for (i, sid) in enumerate(unique_sid))
    profile2id = dict((pid, i) for (i, pid) in enumerate(unique_uid))

    show2id_reverse = dict((i, sid) for (i, sid) in enumerate(unique_sid))
    profile2id_reverse = dict((i, pid) for (i, pid) in enumerate(unique_uid))

    pro_dir = os.path.join(DATA_DIR, 'vae')

    if not os.path.exists(pro_dir):
        os.makedirs(pro_dir)

    with open(os.path.join(pro_dir, 'unique_sid.txt'), 'w') as f:
        for sid in unique_sid:
            f.write('%s\n' % sid)


    vad_plays = raw_data.loc[raw_data['user'].isin(vd_users)]
    vad_plays = vad_plays.loc[vad_plays['item'].isin(unique_sid)]
    vad_plays_tr, vad_plays_te = split_train_test_proportion(vad_plays)

    train_data = numerize(train_plays, profile2id, show2id)
    train_data.to_csv(os.path.join(pro_dir, 'train.csv'), index=False)

    vad_data_tr = numerize(vad_plays_tr, profile2id, show2id)
    vad_data_tr.to_csv(os.path.join(pro_dir, 'validation_tr.csv'), index=False)

    vad_data_te = numerize(vad_plays_te, profile2id, show2id)
    vad_data_te.to_csv(os.path.join(pro_dir, 'validation_te.csv'), index=False)

    with open (os.path.join(pro_dir, 'profile2id_multivae.pickle'), 'wb') as fw:
        pickle.dump(profile2id_reverse, fw)

    with open (os.path.join(pro_dir, 'reverse_show2id_multivae.pickle'), 'wb') as fw:
        pickle.dump(show2id_reverse, fw)

    with open (os.path.join(pro_dir, 'show2id_multivae.pickle'), 'wb') as fw:
        pickle.dump(show2id, fw)

    print("preprocessing 완료")
