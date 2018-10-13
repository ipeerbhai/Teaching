#!/bin/bash
export PATH=$PATH:/home/imran/go-ethereum/build/bin/
geth --mine --minerthreads=1 --datadir ~/gethDataDir --networkid 3 --rpc --rpcport "8000" --rpccorsdomain "*" --port "30303" --nodiscover --rpcapi "db,eth,net,web3" --identity "mbp-linux"
