import {beforeAll, describe, expect, it} from 'bun:test';
import * as service from '$/services/organizations';

describe('create organization', async () => {
	let orgName: string;
	beforeAll(async () => {
		orgName = `testorg-${Date.now()}`;
	});

	it('should create a new organization', async () => {
		const organization = await service.CreateOrganization({
			name: orgName,
		});

		expect(organization).toBeInstanceOf(Object);
		expect(organization).toHaveProperty('id');

		const organizations = await service.GetOrganization({
			organization_id: organization.id,
		});
		expect(organizations).toBeInstanceOf(Object);
		expect(organizations).toHaveProperty('organization');

		expect(organizations.organization).toHaveProperty('id');
		expect(organizations.organization.id).toBe(organization.id);

		expect(organizations.organization).toHaveProperty('name');
		expect(organizations.organization.name).toBe(orgName);
	});

	it('should return error for duplicate organization name', async () => {
		expect(
			service.CreateOrganization({
				name: orgName,
			})
		).rejects.toThrow();
	});

	it('should return error for missing organization name', async () => {
		// @ts-expect-error testing invalid input
		expect(service.CreateOrganization({})).rejects.toThrow();
	});
});

describe('read organization', async () => {
	const ids: Array<string> = [];
	beforeAll(async () => {
		const organizations = await service.GetOrganizations();
		organizations.forEach(org => {
			ids.push(org.id);
		});
	});

	it('should return info for each organization', async () => {
		for (const id of ids) {
			const organizations = await service.GetOrganization({
				organization_id: id,
			});

			expect(organizations).toBeInstanceOf(Object);
			expect(organizations).toHaveProperty('organization');
			expect(organizations.organization).toHaveProperty('id');
			expect(organizations.organization.id).toBe(id);
		}
	});

	it('should return error for invalid organization id', async () => {
		expect(
			service.GetOrganization({
				organization_id: 'invalid_id',
			})
		).rejects.toThrow();
	});

	it('should return error for missing organization id', async () => {
		// @ts-expect-error testing invalid input
		expect(service.GetOrganization({})).rejects.toThrow();
	});
});

describe('update organization', async () => {
	let orgId: string;
	let newOrgName: string;
	beforeAll(async () => {
		const organizations = await service.GetOrganizations();
		orgId = organizations[0].id;
		newOrgName = `testorg-${Date.now() + 10}`;
	});

	it('should update organization name', async () => {
		const organization = await service.UpdateOrganization({
			organization_id: orgId,
			name: newOrgName,
		});

		expect(organization).toBeInstanceOf(Object);

		const organizations = await service.GetOrganization({
			organization_id: orgId,
		});
		expect(organizations).toBeInstanceOf(Object);
		expect(organizations).toHaveProperty('organization');

		expect(organizations.organization).toHaveProperty('id');
		expect(organizations.organization.id).toBe(orgId);

		expect(organizations.organization).toHaveProperty('name');
		expect(organizations.organization.name).toBe(newOrgName);
	});

	it('should return error for invalid organization id', async () => {
		expect(
			service.UpdateOrganization({
				organization_id: 'invalid_id',
				name: newOrgName,
			})
		).rejects.toThrow();
	});

	it('should return error for missing organization id', async () => {
		// @ts-expect-error testing invalid input
		expect(service.UpdateOrganization({})).rejects.toThrow();
	});

	it('should return error for missing organization name', async () => {
		expect(
			service.UpdateOrganization({
				organization_id: orgId,
			})
		).rejects.toThrow();
	});

	it('should return error for duplicate organization name', async () => {
		expect(
			service.UpdateOrganization({
				organization_id: orgId,
				name: newOrgName,
			})
		).rejects.toThrow();
	});
});

describe('delete organization', async () => {
	let orgId: string;
	beforeAll(async () => {
		const organizations = await service.GetOrganizations();
		orgId = organizations[organizations.length - 1].id;
	});

	it('should delete organization', async () => {
		const organization = await service.DeleteOrganization({
			organization_id: orgId,
		});

		expect(organization).toBeInstanceOf(Object);
		expect(
			service.GetOrganization({
				organization_id: orgId,
			})
		).rejects.toThrow();
	});

	it('should return error for invalid organization id', async () => {
		expect(
			service.DeleteOrganization({
				organization_id: 'invalid_id',
			})
		).rejects.toThrow();
	});

	it('should return error for missing organization id', async () => {
		// @ts-expect-error testing invalid input
		expect(service.DeleteOrganization({})).rejects.toThrow();
	});
});
