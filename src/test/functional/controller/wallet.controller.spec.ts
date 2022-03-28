import { it } from "mocha";
import { app } from "../../../app";
import { DatabaseService } from "../../../app/services/databaseService";

import { getConnection } from "typeorm";

const chai = require("chai");
const chaiHttp = require("chai-http");
let should = chai.should();
import { IWalletInterface } from "../../../app/Interfaces/IWalletInterface";

const nock = require('nock');
const uuid = require('uuid');
chai.use(chaiHttp);

let fundWalletApiUrl = '/api/v1/user/fundWallet';
let transferFundApiUrl = '/api/v1/user/transferFund';
let withdrawFundApiUrl = '/api/v1/user/withdrawFund';
let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInVzZXJuYW1lIjoiam9zaCIsImlhdCI6MTY0NzkzOTIxNywiZXhwIjoxNjQ3OTQyODE3fQ.8seyZE7CyzBEJ4qPh9GGh6-mrAklzTLzRgP-jUIhiSo';

describe('Wallet Controller', () => {
    beforeEach(async () => {
        try {
          getConnection()
        } catch (error) {
          await DatabaseService.getConnection();
        }
        return true;
      });

    describe('Fund Wallet', () => {
        it('should Not be able to fund user wallet', async () => {
            const params: IWalletInterface = {
              userId: 2,
              amount: 10000
            }
            chai.request(app).post(fundWalletApiUrl).type('application/json')
            .send(params)
            .set({ "Authorization": "Bearer "+ token })
            .end((err:any, res:any) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
            });
          });
      });

      describe('Transfer Funds', () => {
        it('should not transfer funds to a user that is not registered/created', async () => {
            const params: IWalletInterface = {
              userId: 2,
              amount: 10000
            }
            chai.request(app).post(transferFundApiUrl).type('application/json')
            .send(params)
            .set({ "Authorization": "Bearer "+ token })
            .end((err:any, res:any) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
            });
          });
      });

      describe('Withdraw Funds', () => {
        it('should not be perform request with invalid HTTP request', async () => {
            const params: IWalletInterface = {
              userId: 3,
              amount: 3000
            }
            chai.request(app).post(withdrawFundApiUrl).type('application/json')
            .send(params)
            .set({ "Authorization": "Bearer "+ token })
            .end((err:any, res:any) => {
                res.should.have.status(404);
            });
          });
      });

});