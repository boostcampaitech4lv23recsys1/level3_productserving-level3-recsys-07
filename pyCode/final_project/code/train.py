from models import MultiVAE
import time
from trainers import train, evaluate
import torch.optim as optim
import numpy as np
import torch
import argparse
import os
from utils import (check_path, set_seed)
from models import MultiVAE
from datasets import MultiVAEDataLoader

def main():
    parser = argparse.ArgumentParser()

    parser.add_argument("--data_dir", default="/opt/ml/final project/data/worked/vae", type=str)
    parser.add_argument("--output_dir", default="/opt/ml/final project/output/", type=str)

    parser.add_argument("--no_cuda", action="store_true")
  
    parser.add_argument("--gpu_id", type=str, default="0", help="gpu_id")

    parser.add_argument('--model', default='multivae', type=str)
    parser.add_argument('--data', type=str, default='/opt/ml/final project/data/worked/vae')

    parser.add_argument('--lr', type=float, default=0.0001,
                        help='initial learning rate')
    parser.add_argument('--wd', type=float, default=0.00,
                        help='weight decay coefficient')
    parser.add_argument('--batch_size', type=int, default=256,
                        help='batch size')
    parser.add_argument('--epochs', type=int , default=200,
                        help='upper epoch limit')
    parser.add_argument('--total_anneal_steps', type=int, default=200000,
                        help='the total number of gradient updates for annealing')
    parser.add_argument('--anneal_cap', type=float, default=0.2,
                        help='largest annealing parameter')
    parser.add_argument('--seed', type=int, default=1111,
                        help='random seed')

    parser.add_argument('--log_interval', type=int, default=100, metavar='N',
                        help='report interval')
    parser.add_argument('--save', type=str, default='/opt/ml/final project/output/vae.pt',
                        help='path to save the final model')
    args = parser.parse_args()

    torch.manual_seed(args.seed)

    if torch.cuda.is_available():
        args.cuda = True

    device = torch.device("cuda" if args.cuda else "cpu")

    set_seed(args.seed)
    check_path(args.output_dir)

    os.environ["CUDA_VISIBLE_DEVICES"] = args.gpu_id
    args.cuda_condition = torch.cuda.is_available() and not args.no_cuda

    if args.model == 'multivae':
        loader = MultiVAEDataLoader(args.data)

        n_items = loader.load_n_items()
        train_data = loader.load_data('train')
        vad_data_tr, vad_data_te = loader.load_data('validation')

        N = train_data.shape[0]
        idxlist = list(range(N))


        p_dims = [200, 600, n_items]
        model = MultiVAE(p_dims).to(device)

        optimizer = optim.Adam(model.parameters(), lr=args.lr, weight_decay=args.wd)
        criterion = MultiVAE.loss_function_vae

        best_r20 = -np.inf

        for epoch in range(1, args.epochs + 1):
            epoch_start_time = time.time()
            train(model, idxlist, train_data, device, epoch, is_VAE=True, criterion = criterion, optimizer = optimizer, N = N, batch_size = args.batch_size, total_anneal_steps = args.total_anneal_steps, anneal_cap = args.anneal_cap, log_interval = args.log_interval)
            # val_loss, n100, r20, r50, p10 = evaluate(model = model, criterion = criterion, data_tr = vad_data_tr, data_te = vad_data_te, is_VAE=True, batch_size = args.batch_size, N = N, device = device, total_anneal_steps = args.total_anneal_steps, anneal_cap = args.anneal_cap)
            val_loss, p10 = evaluate(model = model, criterion = criterion, data_tr = vad_data_tr, data_te = vad_data_te, is_VAE=True, batch_size = args.batch_size, N = N, device = device, total_anneal_steps = args.total_anneal_steps, anneal_cap = args.anneal_cap)
            
            # print('-' * 89)
            # print('| end of epoch {:3d} | time: {:4.2f}s | valid loss {:4.2f} | '
            #         'n100 {:5.3f} | r20 {:5.3f} | r50 {:5.3f} | p10 {:5.3f}'.format(
            #             epoch, time.time() - epoch_start_time, val_loss,
            #             n100, r20, r50, p10))
            # print('-' * 89)

            print('-' * 89)
            print('| end of epoch {:3d} | time: {:4.2f}s | valid loss {:4.2f} | '
                    'p10 {:5.3f}'.format(
                        epoch, time.time() - epoch_start_time, val_loss,
                        p10))
            print('-' * 89)

            # n_iter = epoch * len(range(0, N, args.batch_size))

            if p10 > best_r20:
                with open(args.save, 'wb') as f:
                    torch.save(model, f)
                best_r20 = p10

    print('train 완료')
    print('best p10:', p10)

if __name__ == "__main__":
    main()
