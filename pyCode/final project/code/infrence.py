import argparse
import os

import torch

from utils import (check_path, set_seed)

from trainers import make_submission
from datasets import MultiVAEDataLoader
from models import MultiVAE
import pickle
import pandas as pd

def main():
    parser = argparse.ArgumentParser()

    parser.add_argument("--data_dir", default="../data/worked/vae/", type=str)
    parser.add_argument("--output_dir", default="../output", type=str)
    parser.add_argument("--data_name", default="Ml", type=str)
    parser.add_argument("--do_eval", action="store_true")
    parser.add_argument("--model_name", default="Finetune_full", type=str)
    parser.add_argument(
        "--hidden_size", type=int, default=64, help="hidden size of transformer model"
    )
    parser.add_argument(
        "--num_hidden_layers", type=int, default=2, help="number of layers"
    )
    parser.add_argument("--num_attention_heads", default=2, type=int)
    parser.add_argument("--hidden_act", default="gelu", type=str)  
    parser.add_argument(
        "--attention_probs_dropout_prob",
        type=float,
        default=0.5,
        help="attention dropout p",
    )
    parser.add_argument(
        "--hidden_dropout_prob", type=float, default=0.5, help="hidden dropout p"
    )
    parser.add_argument("--initializer_range", type=float, default=0.02)
    parser.add_argument("--max_seq_length", default=50, type=int)
    parser.add_argument("--lr", type=float, default=0.001, help="learning rate of adam")
    parser.add_argument(
        "--batch_size", type=int, default=256, help="number of batch_size"
    )
    parser.add_argument("--epochs", type=int, default=200, help="number of epochs")
    parser.add_argument("--no_cuda", action="store_true")
    parser.add_argument("--log_freq", type=int, default=1, help="per epoch print res")
    parser.add_argument("--seed", default=42, type=int)

    parser.add_argument(
        "--weight_decay", type=float, default=0.0, help="weight_decay of adam"
    )
    parser.add_argument(
        "--adam_beta1", type=float, default=0.9, help="adam first beta value"
    )
    parser.add_argument(
        "--adam_beta2", type=float, default=0.999, help="adam second beta value"
    )
    parser.add_argument("--gpu_id", type=str, default="0", help="gpu_id")
    parser.add_argument('--model', default='multivae', type=str)
    parser.add_argument('--data', type=str, default='../data/worked/vae/',
                        help='Movielens dataset location')
    parser.add_argument('--wd', type=float, default=0.00,
                        help='weight decay coefficient')
    parser.add_argument('--total_anneal_steps', type=int, default=200000,
                        help='the total number of gradient updates for annealing')
    parser.add_argument('--anneal_cap', type=float, default=0.2,
                        help='largest annealing parameter')
    parser.add_argument('--cuda', action='store_true',
                        help='use CUDA')
    parser.add_argument('--log_interval', type=int, default=100, metavar='N',
                        help='report interval')
    parser.add_argument('--save', type=str, default='../output/multivae.pt',
                        help='path to save the final model')

    args = parser.parse_args()

    set_seed(args.seed)
    check_path(args.output_dir)

    os.environ["CUDA_VISIBLE_DEVICES"] = args.gpu_id
    args.cuda_condition = torch.cuda.is_available() and not args.no_cuda

    if torch.cuda.is_available():
        args.cuda = True

    device = torch.device("cuda" if args.cuda else "cpu")

    song_meta = pd.read_json('../data/original/song_meta.json')
    song_meta['artist_name'] = song_meta['artist_name_basket'].apply(lambda x:x[0])
    if args.model == 'multivae':

        with open('../output/vae.pt', 'rb') as f:
            model = torch.load(f)

        loader = MultiVAEDataLoader(args.data)

        test_data = loader.load_data('test')

        criterion = MultiVAE.loss_function_vae
        N = test_data.shape[0]
        final = make_submission(model = model, criterion = criterion, data_tr = test_data, is_VAE=True, batch_size = args.batch_size, N = N, device = device, total_anneal_steps = args.total_anneal_steps, anneal_cap = args.anneal_cap)
        
        with open('../data/worked/vae/reverse_show2id_multivae.pickle', 'rb') as fr:
            aa = pickle.load(fr)

        final = final.rename(columns = {0:'item'})
        ee = final['item'].apply(lambda x: aa[x])
        final['item'] = ee
        song_meta_inference = song_meta.iloc[final['item']][['song_name', 'artist_name']]
        final['song_name'] = list(song_meta_inference['song_name'])
        final['artist'] = list(song_meta_inference['artist_name'])
        final.to_csv('../output/submission_vae.csv')

        print('inference 완료')
if __name__ == "__main__":
    main()