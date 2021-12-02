import { Employee } from '../models/employee';
import { Enterprise } from '../models/enterprise';
import { User } from '../models/user';

/*
 * vou até escrever aqui em Português.
 * fiz essa gambiarra ali na linha 66 porque precisava ter acesso as propriedades de "findEmployee",
 * mas com .find() não dava para ter acesso a essas propriedades, então troquei para .findOne() para ter acesso a elas,
 * e como o nome já prediz ela busca somente uma propriedade por vez,
 * então usei o setInterval para quando tiver a propriedade "nextsalary" igual a varios documentos a cada novo loop
 * ela atualizaria um novo documento, ja que no .findOne() sem o setInterval iria atualizar somente o primeiro documento que achasse
 * e depois não atualizaria mais, somente quando a aplicação reiniciasse,
 * e quando tiver somente um documento ele vai atualizar sozinho e não tera um setInterval.
 */

(async (): Promise<void> => {
  const strToday = JSON.stringify(new Date());

  const [Year, Month, day] = strToday.split('-');
  const [Day, others] = day.split('T');

  const formatDate = `${Year}/${Month}/${Day}`;

  const findDateEmployee = await Employee.find({ nextsalary: formatDate });

  async function paymentOfSalaries() {
    const findEmployees = await Employee.findOne({ nextsalary: formatDate });

    if (!findEmployees) return;

    let month = new Date().getUTCMonth() + 3;
    let year = new Date().getUTCFullYear();

    const [, , Day] = findEmployees.nextsalary.split('/');

    if (month > 12 || month < 1) {
      month = 1;
    } else if (month === 1 && year === new Date().getUTCFullYear()) {
      year = new Date().getUTCFullYear() + 1;
    }

    await Employee.findOneAndUpdate(
      { _id: findEmployees._id },
      { nextsalary: `"${year}/${month}/${Day}` }
    );

    await User.updateMany(
      { employeeEnterprise: findEmployees.enterprise },
      { $inc: { moneyoutcoins: findEmployees.salary } }
    );

    await Enterprise.findOneAndUpdate(
      { _id: findEmployees.enterprise },
      {
        $inc: {
          moneyoutcoins: -findEmployees.salary * findEmployees.employee.length,
        },
      }
    );
  }

  if (findDateEmployee.length > 1) {
    setInterval(paymentOfSalaries, 200000);
  } else if (findDateEmployee.length === 1) {
    const findEmployees = await Employee.findOne({ nextsalary: formatDate });

    if (!findEmployees) return;

    let month = new Date().getUTCMonth() + 3;
    let year = new Date().getUTCFullYear();

    const [, , Day] = findEmployees.nextsalary.split('/');

    if (month > 12 || month < 1) {
      month = 1;
    } else if (month === 1 && year === new Date().getUTCFullYear()) {
      year = new Date().getUTCFullYear() + 1;
    }

    await Employee.findOneAndUpdate(
      { _id: findEmployees._id },
      { nextsalary: `"${year}/${month}/${Day}` }
    );

    await User.updateMany(
      { employeeEnterprise: findEmployees.enterprise },
      { $inc: { moneyoutcoins: findEmployees.salary } }
    );

    await Enterprise.findOneAndUpdate(
      { _id: findEmployees.enterprise },
      {
        $inc: {
          moneyoutcoins: -findEmployees.salary * findEmployees.employee.length,
        },
      }
    );
  } else {
    console.log('não tem kkkk');
  }
})();
