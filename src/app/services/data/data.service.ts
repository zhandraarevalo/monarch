import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  get(language: string = 'es') {
    return this.static[language];
  }

  static: { [key: string]: any } = {
    es: {
      auth: {
        googleSignIn: 'Conectarme con Google',
        signOut: 'Desconectarme',
      },
      button: {
        accept: 'Aceptar',
      },
      catalogue: {
        categoryType: {
          expense: 'Gastos',
          income: 'Ingresos',
          operation: 'Operación',
          saving: 'Ahorro',
        },
        paymentType: {
          entry: 'Ingreso',
          exit: 'Egreso',
        },
        transactionType: {
          exchange: 'Cambio',
          payment: 'Pago',
          transfer: 'Transferencia',
        },
        walletType: {
          balance: 'Saldo',
          saving: 'Ahorro',
          reserve: 'Reserva',
          other: 'Otra',
        },
      },
      modules: {
        admin: {
          title: 'Administración',
        },
        dashboard: {
          title: 'Monitor',
        },
      },
      notificationStatus: {
        error: 'Error',
      },
    }
  }

}
