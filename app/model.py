import torch
import numpy as np
import pandas as pd
import pickle
from datasets import MultiVAEDataLoader
import sklearn
import joblib
import bottleneck as bn

device = torch.device("cuda")



# 딥 러닝 모델이 아니므로 nn.Module을 상속받을 필요가 없다. 
class EASE:
    def __init__(self, _lambda=0.5):
        self.B = None
        self._lambda = _lambda

    def train(self, X):
        X = X.toarray()
        G = X.T @ X # G = X'X
        diag_indices = np.diag_indices(G.shape[0])
        G[diag_indices] += self._lambda   # X'X + λI
        P = np.linalg.inv(G)    # P = (X'X + λI)^(-1)
        self.B = P / -np.diag(P)    # - P_{ij} / P_{jj} if i ≠ j
        self.B[diag_indices] = 0  # 대각행렬 원소만 0으로 만들어주기 위해

    def forward(self, user_row):
        return user_row @ self.B

def load_model_vae_pt():
    with open('../data/vae.pt', 'rb') as f:
        model = torch.load(f)
    return model

def load_model_lgbm_pt():
    model = joblib.load('lgb.pkl')
    return model

def naive_sparse2tensor(data):
    return torch.FloatTensor(data.toarray())

def get_model_rec(model, input_ids, top_k):

    model = model

    loader = MultiVAEDataLoader()

    test_data = loader._load_test_data(input_ids)

    model.eval()

    final_list = []
    with torch.no_grad():

        data_tensor = naive_sparse2tensor(test_data).to(device)

        recon_batch, _, _ = model(data_tensor)

        recon_batch = recon_batch.cpu().numpy()
        recon_batch[test_data.nonzero()] = -np.inf

        batch_users = recon_batch.shape[0]
        idx_topk_part = bn.argpartition(-recon_batch, top_k, axis=1)
        topk_part = recon_batch[np.arange(batch_users)[:, np.newaxis],
                        idx_topk_part[:, :top_k]]
        idx_part = np.argsort(-topk_part, axis=1)

        idx_topk = idx_topk_part[np.arange(batch_users)[:, np.newaxis], idx_part]
        idx_topk = pd.DataFrame(idx_topk.reshape(-1,1))
        final_list.append(idx_topk)
        array = pd.concat(final_list)
        print('finish...')
    
    final = array

    with open('../data/reverse_show2id_multivae.pickle', 'rb') as fr:
        aa = pickle.load(fr)
    final = final.rename(columns = {0:'item'})
    ee = final['item'].apply(lambda x: aa[x])
    final['item'] = ee

    return final

def get_model_rec_lgbm(model, test_file, train, input_ids, top_k):
    model = model
    # train = train 배치에서 돌린 train의 아이템 리스트
    total_preds = model.predict(test_file)
    submission = pd.DataFrame()
    submission['item'] = test_file['id']#song meta id 붙여줘야함
    submission['pred'] = total_preds
    total_input = train + input_ids
    submission = submission[~submission['item'].isin(total_input)]
    submission = submission.sort_values('pred', ascending=False)[:top_k]
    return submission['item'].tolist()


    # import pymysql
    # """Model을 가져옵니다"""
    # train = pd.read_csv("../data/230130_train_cri50.csv")

    # # database connection
    # conn = pymysql.connect(
    #     host='database-2.csf4gv44uzg9.ap-northeast-2.rds.amazonaws.com',
    #     port=3306,
    #     charset='utf8',
    #     user='admin',
    #     passwd='wjdtmddus1!',
    #     db='test_final'
    # )

    # # database cursor
    # cursor = conn.cursor()
    # sql = """SELECT searched_track_id
    #         FROM test 
    #         WHERE searched_track_name REGEXP '[가-힇]'  and not searched_track_id = 'not matched' and not searched_track_id = 'code 400'
    #         LIMIT 200;"""
    # cursor.execute(sql)

    # res = cursor.fetchall()
    # df = pd.DataFrame(res, columns=['item'])

    # import random
    # user = []
    # item = []
    # for j in range(100):
    #     user.append(j)
    #     item.append(list(df.sample(random.randint(5,20))['item'].values))
    #     # user[j] = 

    # df_dict = {
    #     "user" : user,
    #     "item" : item
    # }

    # res_df = pd.DataFrame(df_dict)
    # train = res_df.explode('item')


    # train = pd.DataFrame(res, columns=['user','item'])

    # users = train['user'].unique()
    # items = train['item'].unique()

    # user2id = dict((user, id) for (id, user) in enumerate(users))
    # item2id = dict((item, id) for (id, item) in enumerate(items))
    # id2user = dict((id, user) for (id, user) in enumerate(users))
    # id2item = dict((id, item) for (id, item) in enumerate(items))

    # user_id = train['user'].apply(lambda x: user2id[x])
    # item_id = train['item'].apply(lambda x: item2id[x])
    # values = np.ones(train.shape[0])

    # X = csr_matrix((values, (user_id, item_id)))

    # model.train(X)

    # input_ids = [item2id[i] for i in input_ids]
    # Y = csr_matrix(([1]*len(input_ids), ([0]*len(input_ids), input_ids)), shape=(1, len(items)))
    # result = -model.forward(Y)
    # result[Y.nonzero()] = np.inf  # 이미 어떤 한 유저가 클릭 또는 구매한 아이템 이력은 제외
    # result = result.argsort()[:,:top_k]
    # result = [id2item[i] for i in result[0]]


def get_random_rec(top_k):
    top_k = int(top_k)
    train = pd.read_csv("app_mission/poster.csv", sep="\t")
    train.fillna("", inplace=True)
    return train.sample(top_k)

if __name__ == "__main__":
    model = EASE()
    tmp = [525514, 562083, 297861]
    result = get_model_rec(model=model, input_ids=tmp, top_k=10)