import { Client } from '@hubspot/api-client'
import { FilterOperatorEnum } from '@hubspot/api-client/lib/codegen/crm/contacts/models/Filter'
import { AssociationSpecAssociationCategoryEnum } from '@hubspot/api-client/lib/codegen/crm/objects/notes/models/AssociationSpec'

const hubspotClient = new Client({ accessToken: process.env.HUBSPOT_ACCESS_TOKEN })

type LifecycleStage = 'subscriber' | 'lead' | 'marketingqualifiedlead' | 'salesqualifiedlead' | 'opportunity' | 'customer' | 'evangelist' | 'other'
type LeadStatus = 'NEW' | 'OPEN' | 'IN_PROGRESS' | 'OPEN_DEAL' | 'UNQUALIFIED' | 'ATTEMPTED_TO_CONTACT' | 'CONNECTED' | 'BAD_TIMING'

export async function createOrUpdateContact(data: {
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  lifecyclestage?: LifecycleStage
  leadStatus?: LeadStatus
}): Promise<{ id: string }> {
  try {
    const properties: Record<string, string> = { email: data.email }

    if (data.firstName)      properties.firstname      = data.firstName
    if (data.lastName)       properties.lastname       = data.lastName
    if (data.phone)          properties.phone          = data.phone
    if (data.lifecyclestage) properties.lifecyclestage = data.lifecyclestage
    if (data.leadStatus)     properties.hs_lead_status = data.leadStatus

    try {
      const response = await hubspotClient.crm.contacts.basicApi.create({
        properties,
        associations: [],
      })
      return { id: response.id }
    } catch (createError: unknown) {
      const err = createError as { code?: number; body?: { category?: string } }
      if (err.code === 409 || err.body?.category === 'CONFLICT') {
        const searchResponse = await hubspotClient.crm.contacts.searchApi.doSearch({
          filterGroups: [
            {
              filters: [
                {
                  propertyName: 'email',
                  operator: FilterOperatorEnum.Eq,
                  value: data.email,
                },
              ],
            },
          ],
          properties: ['email'],
          limit: 1,
          after: '0',
          sorts: [],
        })

        const existing = searchResponse.results[0]
        if (!existing) throw createError

        await hubspotClient.crm.contacts.basicApi.update(existing.id, { properties })
        return { id: existing.id }
      }
      throw createError
    }
  } catch (error) {
    console.error('[HubSpot] createOrUpdateContact error:', error)
    throw error
  }
}

export async function createContactNote(contactId: string, body: string) {
  try {
    const note = await hubspotClient.crm.objects.notes.basicApi.create({
      properties: {
        hs_note_body: body,
        hs_timestamp: Date.now().toString(),
      },
      associations: [
        {
          to: { id: contactId },
          types: [{ associationCategory: AssociationSpecAssociationCategoryEnum.HubspotDefined, associationTypeId: 202 }],
        },
      ],
    })
    return note
  } catch (error) {
    console.error('[HubSpot] createContactNote error:', error)
    throw error
  }
}

export async function addContactToList(contactId: string, listId: string) {
  try {
    const response = await hubspotClient.crm.lists.membershipsApi.add(listId, [contactId])
    return response
  } catch (error) {
    console.error('[HubSpot] addContactToList error:', error)
    throw error
  }
}
