import { Banka } from './banka.model';

export interface Filijala {
  id?: number;
  adresa: string;
  brojPultova?: number;
  posedujeSef?: boolean;
  banka: Banka;  // ← Ceo objekat, ne samo ID!
}