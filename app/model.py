import torch
import numpy as np
import pandas as pd
from scipy.sparse import csr_matrix
# device = torch.device("cuda")

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


def get_model_rec(model, input_ids, top_k) -> EASE:
    """Model을 가져옵니다"""
    train = pd.read_csv("../data/train/kakao_song_data2.csv")[:100]
    users = train['user'].unique()
    items = train['item'].unique()

    user2id = dict((user, id) for (id, user) in enumerate(users))
    item2id = dict((item, id) for (id, item) in enumerate(items))
    id2user = dict((id, user) for (id, user) in enumerate(users))
    id2item = dict((id, item) for (id, item) in enumerate(items))

    user_id = train['user'].apply(lambda x: user2id[x])
    item_id = train['item'].apply(lambda x: item2id[x])
    values = np.ones(train.shape[0])

    X = csr_matrix((values, (user_id, item_id)))

    model.train(X)

    input_ids = [item2id[i] for i in input_ids]
    Y = csr_matrix(([1]*len(input_ids), ([0]*len(input_ids), input_ids)), shape=(1, len(items)))
    result = -model.forward(Y)
    result[Y.nonzero()] = np.inf  # 이미 어떤 한 유저가 클릭 또는 구매한 아이템 이력은 제외
    result = result.argsort()[:,:top_k]
    result = [id2item[i] for i in result[0]]
    
    return result

def get_random_rec(top_k):
    top_k = int(top_k)
    train = pd.read_csv("app_mission/poster.csv", sep="\t")
    train.fillna("", inplace=True)
    return train.sample(top_k)

if __name__ == "__main__":
    model = EASE()
    tmp = [525514, 562083, 297861]
    result = get_model_rec(model=model, input_ids=tmp, top_k=10)