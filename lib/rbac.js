import Promise from 'bluebird';
import findIndex from 'lodash/findIndex';
import forEach from 'lodash/forEach';
import last from 'lodash/last';
import Role from './role';

export default class RBAC {
  constructor(roles) {
    if (typeof roles !== 'object') {
      throw new TypeError('Expected an object as input');
    }

    this.roles = {};
    forEach(roles, (o, key) => {
      this.roles[key] = new Role(roles, o);
    });
  }

  role(role) {
    if (!this.roles[role]) throw new TypeError(`Role ${role} doesn't exist`);
    return this.roles[role];
  }
}
