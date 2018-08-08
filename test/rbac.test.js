import rbac from '../lib/rbac';
import roles from './roles-for-test';

const RBAC = new rbac(roles);

test('Testing classic permissions', async () => {
  expect(await RBAC.role('guest').can('public')).toBe(true);
  expect(await RBAC.role('user').can('account')).toBe(true);
  expect(await RBAC.role('admin').can('admin')).toBe(true);

  expect(await RBAC.role('guest').can('account')).toBe(false);
  expect(await RBAC.role('user').can('admin')).toBe(false);
});

test('Testing inheritance', async () => {
  expect(await RBAC.role('user').can('account')).toBe(true);
  expect(await RBAC.role('admin').can('account')).toBe(true);
  expect(await RBAC.role('guest').can('account')).toBe(false);
});

test('Testing wilcard', async () => {
  expect(await RBAC.role('admin').can('blog:list')).toBe(true);
  expect(await RBAC.role('admin').can('blog:list:all')).toBe(true);

  expect(await RBAC.role('user').can('blog:list')).toBe(false);
  expect(await RBAC.role('user').can('blog:list:all')).toBe(false);

  expect(await RBAC.role('guest').can('blog:list')).toBe(false);
  expect(await RBAC.role('guest').can('blog:list:all')).toBe(false);
});

// test('Testing when condition', async () => {
//   expect(await RBAC.role('admin').can('blog:edit')).toBe(true);
//   expect(await RBAC.role('user').can('blog:edit', 0, 1)).toBe(false);
//   expect(await RBAC.role('user').can('blog:edit', 1, 0)).toBe(false);
//   expect(await RBAC.role('user').can('blog:edit', 1, 1)).toBe(true);
//
//   expect(async () => await RBAC.role('user').can('blog:edit')).toThrow(TypeError);
//   expect(async () => await RBAC.role('user').can('blog:edit', 1)).toThrow(TypeError);
//   expect(async () => await RBAC.role('user').can('blog:edit', 1, 2, 3)).toThrow(TypeError);
// });
