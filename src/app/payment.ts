
import { Timestamp } from 'firebase/firestore';

export interface Payment {
    id?: string;
    paymentDate: Timestamp | Date;
    paymentAmount: number;
}