import { NextApiRequest, NextApiResponse } from 'next';


// example data for now

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json([ 
    {
      "username": "user1",
      "total": 150
    },
    {
      "username": "user2",
      "total": 140
    },
    {
      "username": "user3",
      "total": 130
    },
    {
      "username": "user4",
      "total": 120
    },
    {
      "username": "user5",
      "total": 110
    },
    {
      "username": "user6",
      "total": 100
    },
    {
      "username": "user7",
      "total": 90
    },
    {
      "username": "user8",
      "total": 80
    },
    {
      "username": "user9",
      "total": 70
    },
    {
      "username": "user10",
      "total": 60
    }
  ]);
}