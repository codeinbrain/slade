import Promise from 'bluebird';
import findIndex from 'lodash/findIndex';
import forEach from 'lodash/forEach';
import last from 'lodash/last';

export default class Role {
  constructor(roles, role) {
    if (typeof roles !== 'object' || typeof role !== 'object') {
      throw new TypeError('Expected an object as inputs');
    }

    this.$can = role.can;
    this.inherits = (role.inherits || []).map((v) => {
      return new Role(roles, roles[v]);
    })
  }

  async can(operation, ...args) {
    const ops = [operation];
    do {
      let o = last(ops).replace(/(\:[a-z0-9]+)\:\*/g, '$1').replace(/\:(?:[a-z0-9]+)$/gi, ':*');
      if (o === last(ops)) break;
      ops.push(o);
    } while(true);

    for (let v of this.$can) {
      if (typeof v === 'string' && ops.includes(v)) {
        return Promise.resolve(true);
      }

      if (typeof v === 'object') {
        if (!ops.includes(v.name)) continue;
        if (args.length < 3) {
          throw new TypeError(`'can' function of RBAC requires at least 3 arguments but ${args.length} were given`);
        }

        if (await v.when(...args)) return Promise.resolve(true);
      }
    }

    for (let o of this.inherits) {
      if (await o.can(operation, ...args)) return Promise.resolve(true);
    }

    return Promise.resolve(false);
  }
}
