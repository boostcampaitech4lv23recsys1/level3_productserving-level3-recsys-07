import numpy as np
import torch
import torch.nn as nn
import tqdm
from torch.optim import Adam
import time
from utils import NDCG_binary_at_k_batch, Recall_at_k_batch
import bottleneck as bn
import pandas as pd


def naive_sparse2tensor(data):
    return torch.FloatTensor(data.toarray())


def train(model, idxlist, train_data, device, epoch, criterion, optimizer, N, batch_size, total_anneal_steps, anneal_cap, log_interval, is_VAE = False):
    # Turn on training mode
    model.train()
    train_loss = 0.0
    start_time = time.time()
    global update_count
    update_count = 0

    np.random.shuffle(idxlist)
    
    for batch_idx, start_idx in enumerate(range(0, N, batch_size)):
        end_idx = min(start_idx + batch_size, N)
        data = train_data[idxlist[start_idx:end_idx]]
        data = naive_sparse2tensor(data).to(device)
        optimizer.zero_grad()

        if is_VAE:
          if total_anneal_steps > 0:
            anneal = min(anneal_cap, 
                            1. * update_count / total_anneal_steps)
          else:
              anneal = anneal_cap

          optimizer.zero_grad()
          recon_batch, mu, logvar = model(data)
          
          loss = criterion(recon_batch, data, mu, logvar, anneal)
        else:
          recon_batch = model(data)
          loss = criterion(recon_batch, data)

        loss.backward()
        train_loss += loss.item()
        optimizer.step()

        update_count += 1

        if batch_idx % log_interval == 0 and batch_idx > 0:
            elapsed = time.time() - start_time
            print('| epoch {:3d} | {:4d}/{:4d} batches | ms/batch {:4.2f} | '
                    'loss {:4.2f}'.format(
                        epoch, batch_idx, len(range(0, N, batch_size)),
                        elapsed * 1000 / log_interval,
                        train_loss / log_interval))
            

            start_time = time.time()
            train_loss = 0.0


def evaluate(model, criterion, data_tr, data_te, batch_size, N, device, total_anneal_steps, anneal_cap, is_VAE=False):
    # Turn on evaluation mode
    model.eval()
    total_loss = 0.0
    global update_count
    e_idxlist = list(range(data_tr.shape[0]))
    e_N = data_tr.shape[0]
    n100_list = []
    r20_list = []
    r50_list = []

    with torch.no_grad():
        for start_idx in range(0, e_N, batch_size):
            end_idx = min(start_idx + batch_size, N)
            data = data_tr[e_idxlist[start_idx:end_idx]]
            heldout_data = data_te[e_idxlist[start_idx:end_idx]]

            data_tensor = naive_sparse2tensor(data).to(device)
            if is_VAE :
              
              if total_anneal_steps > 0:
                  anneal = min(anneal_cap, 
                                1. * update_count / total_anneal_steps)
              else:
                  anneal = anneal_cap

              recon_batch, mu, logvar = model(data_tensor)

              loss = criterion(recon_batch, data_tensor, mu, logvar, anneal)

            else :
              recon_batch = model(data_tensor)
              loss = criterion(recon_batch, data_tensor)




            total_loss += loss.item()

            # Exclude examples from training set
            recon_batch = recon_batch.cpu().numpy()
            recon_batch[data.nonzero()] = -np.inf

            n100 = NDCG_binary_at_k_batch(recon_batch, heldout_data, 100)
            r20 = Recall_at_k_batch(recon_batch, heldout_data, 20)
            r50 = Recall_at_k_batch(recon_batch, heldout_data, 50)

            n100_list.append(n100)
            r20_list.append(r20)
            r50_list.append(r50)

    total_loss /= len(range(0, e_N, batch_size))
    n100_list = np.concatenate(n100_list)
    r20_list = np.concatenate(r20_list)
    r50_list = np.concatenate(r50_list)

    return total_loss, np.mean(n100_list), np.mean(r20_list), np.mean(r50_list)

def make_submission(model, criterion, data_tr, batch_size, N, device, total_anneal_steps, anneal_cap, is_VAE=False):
    # Turn on evaluation mode
    model.eval()
    global update_count
    update_count = 0
    e_idxlist = list(range(data_tr.shape[0]))
    e_N = data_tr.shape[0]
    final_list = []
    with torch.no_grad():
        for start_idx in range(0, e_N, batch_size):
            end_idx = min(start_idx + batch_size, N)
            data = data_tr[e_idxlist[start_idx:end_idx]]
            # heldout_data = data_te[e_idxlist[start_idx:end_idx]]

            data_tensor = naive_sparse2tensor(data).to(device)
            if is_VAE :
              
              if total_anneal_steps > 0:
                  anneal = min(anneal_cap, 
                                1. * update_count / total_anneal_steps)
              else:
                  anneal = anneal_cap

              recon_batch, mu, logvar = model(data_tensor)

              loss = criterion(recon_batch, data_tensor, mu, logvar, anneal)

            else :
              recon_batch = model(data_tensor)
              loss = criterion(recon_batch, data_tensor)

            # Exclude examples from training set
            recon_batch = recon_batch.cpu().numpy()
            recon_batch[data.nonzero()] = -np.inf
 
            batch_users = recon_batch.shape[0]
            idx_topk_part = bn.argpartition(-recon_batch, 10, axis=1)
            topk_part = recon_batch[np.arange(batch_users)[:, np.newaxis],
                            idx_topk_part[:, :10]]
            idx_part = np.argsort(-topk_part, axis=1)

            idx_topk = idx_topk_part[np.arange(batch_users)[:, np.newaxis], idx_part]
            idx_topk = pd.DataFrame(idx_topk.reshape(-1,1))
            final_list.append(idx_topk)
            print('doing...')
        array = pd.concat(final_list)
    
    final = array
    return final