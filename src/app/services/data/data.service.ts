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
        countryIso: {
          MX: 'México',
          US: 'Estados Unidos',
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
        finances: {
          title: 'Finanzas',
          settings: 'Configuraciones de finanzas',
          currencySettings: 'Configuración de monedas',
          accountSettings: 'Configuración de cuentas',
          accountCreate: 'Crear cuenta',
          accountUpdate: 'Editar cuenta',
          bankStatement: 'Estado de cuenta',
          budget: 'Presupuesto',
          categorySettings: 'Configuración de categorías',
          categoryCreate: 'Crear categoría',
          categoryUpdate: 'Editar categoría',
          expenseBudget: 'Presupuesto de gastos',
          expenseTotal: 'Total de gastos',
          incomeBudget: 'Presupuesto de ingresos',
          incomeTotal: 'Total de ingresos',
          groupSettings: 'Configuración de grupos',
          groupCreate: 'Crear grupo',
          groupUpdate: 'Editar grupo',
          reserveBudget: 'Presupuesto de reserva',
          reserveTotal: 'Total de reserva',
          savingBudget: 'Presupuesto de ahorros',
          savingTotal: 'Total de ahorros',
          transactionPayment: 'Pagar',
          transactionTransfer: 'Transferir',
          transactionExchange: 'Cambiar',
          walletSettings: 'Configuración de billeteras',
          walletCreate: 'Crear billetera',
          walletUpdate: 'Editar billetera',
        },
        locker: {
          title: 'Contraseñas',
        },
        profile: {
          title: 'Perfil',
        },
        resume: {
          title: 'Currículum',
        },
      },
      notificationStatus: {
        error: 'Error',
      },
      select: {
        account: 'Seleccione una cuenta',
        category: 'Seleccione una categoría',
        currency: 'Seleccione una moneda',
        group: 'Seleccione un grupo',
        wallet: 'Seleccione una billetera',
        categoryType: 'Seleccione el tipo de categoría',
        paymentType: 'Seleccione el tipo de pago',
        transactionType: 'Seleccione el tipo de transacción',
        walletType: 'Seleccione el tipo de billetera',
      },
      tag: {
        account: 'Cuenta',
        accumulates: 'Acumula',
        active: 'Activo',
        amount: 'Monto',
        balance: 'Saldo',
        budget: 'Presupuesto',
        category: 'Categoría',
        country: 'País',
        currency: 'Moneda',
        currentAmount: 'Monto actual',
        date: 'Fecha',
        entryAccount: 'Cuenta de ingreso',
        entryWallet: 'Billetera de ingreso',
        exitAccount: 'Cuenta de egreso',
        exitWallet: 'Billetera de egreso',
        group: 'Grupo',
        initialBalance: 'Saldo inicial',
        iso: 'Código ISO',
        main: 'Principal',
        name: 'Nombre',
        noRows: 'No hay registros para mostrar',
        requiredFields: 'Campos requeridos',
        type: 'Tipo',
        wallet: 'Billetera',
      }
    }
  }

}
