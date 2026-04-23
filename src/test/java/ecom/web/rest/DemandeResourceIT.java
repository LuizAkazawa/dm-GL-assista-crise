package ecom.web.rest;

import static ecom.domain.DemandeAsserts.*;
import static ecom.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import ecom.IntegrationTest;
import ecom.domain.Demande;
import ecom.domain.enumeration.StatutDemande;
import ecom.repository.DemandeRepository;
import ecom.service.DemandeService;
import jakarta.persistence.EntityManager;
import java.util.ArrayList;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link DemandeResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class DemandeResourceIT {

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_TYPE_BESOIN = "AAAAAAAAAA";
    private static final String UPDATED_TYPE_BESOIN = "BBBBBBBBBB";

    private static final String DEFAULT_GEOLOCALISATION = "AAAAAAAAAA";
    private static final String UPDATED_GEOLOCALISATION = "BBBBBBBBBB";

    private static final StatutDemande DEFAULT_STATUT = StatutDemande.OUVERTE;
    private static final StatutDemande UPDATED_STATUT = StatutDemande.EN_COURS_DE_RESOLUTION;

    private static final Boolean DEFAULT_IS_ARCHIVED = false;
    private static final Boolean UPDATED_IS_ARCHIVED = true;

    private static final String ENTITY_API_URL = "/api/demandes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private DemandeRepository demandeRepository;

    @Mock
    private DemandeRepository demandeRepositoryMock;

    @Mock
    private DemandeService demandeServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDemandeMockMvc;

    private Demande demande;

    private Demande insertedDemande;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Demande createEntity() {
        return new Demande()
            .description(DEFAULT_DESCRIPTION)
            .typeBesoin(DEFAULT_TYPE_BESOIN)
            .geolocalisation(DEFAULT_GEOLOCALISATION)
            .statut(DEFAULT_STATUT)
            .isArchived(DEFAULT_IS_ARCHIVED);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Demande createUpdatedEntity() {
        return new Demande()
            .description(UPDATED_DESCRIPTION)
            .typeBesoin(UPDATED_TYPE_BESOIN)
            .geolocalisation(UPDATED_GEOLOCALISATION)
            .statut(UPDATED_STATUT)
            .isArchived(UPDATED_IS_ARCHIVED);
    }

    @BeforeEach
    void initTest() {
        demande = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedDemande != null) {
            demandeRepository.delete(insertedDemande);
            insertedDemande = null;
        }
    }

    @Test
    @Transactional
    void createDemande() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Demande
        var returnedDemande = om.readValue(
            restDemandeMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(demande)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Demande.class
        );

        // Validate the Demande in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertDemandeUpdatableFieldsEquals(returnedDemande, getPersistedDemande(returnedDemande));

        insertedDemande = returnedDemande;
    }

    @Test
    @Transactional
    void createDemandeWithExistingId() throws Exception {
        // Create the Demande with an existing ID
        demande.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDemandeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(demande)))
            .andExpect(status().isBadRequest());

        // Validate the Demande in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTypeBesoinIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        demande.setTypeBesoin(null);

        // Create the Demande, which fails.

        restDemandeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(demande)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkGeolocalisationIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        demande.setGeolocalisation(null);

        // Create the Demande, which fails.

        restDemandeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(demande)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkStatutIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        demande.setStatut(null);

        // Create the Demande, which fails.

        restDemandeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(demande)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllDemandes() throws Exception {
        // Initialize the database
        insertedDemande = demandeRepository.saveAndFlush(demande);

        // Get all the demandeList
        restDemandeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(demande.getId().intValue())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].typeBesoin").value(hasItem(DEFAULT_TYPE_BESOIN)))
            .andExpect(jsonPath("$.[*].geolocalisation").value(hasItem(DEFAULT_GEOLOCALISATION)))
            .andExpect(jsonPath("$.[*].statut").value(hasItem(DEFAULT_STATUT.toString())))
            .andExpect(jsonPath("$.[*].isArchived").value(hasItem(DEFAULT_IS_ARCHIVED)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllDemandesWithEagerRelationshipsIsEnabled() throws Exception {
        when(demandeServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restDemandeMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(demandeServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllDemandesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(demandeServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restDemandeMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(demandeRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getDemande() throws Exception {
        // Initialize the database
        insertedDemande = demandeRepository.saveAndFlush(demande);

        // Get the demande
        restDemandeMockMvc
            .perform(get(ENTITY_API_URL_ID, demande.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(demande.getId().intValue()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.typeBesoin").value(DEFAULT_TYPE_BESOIN))
            .andExpect(jsonPath("$.geolocalisation").value(DEFAULT_GEOLOCALISATION))
            .andExpect(jsonPath("$.statut").value(DEFAULT_STATUT.toString()))
            .andExpect(jsonPath("$.isArchived").value(DEFAULT_IS_ARCHIVED));
    }

    @Test
    @Transactional
    void getNonExistingDemande() throws Exception {
        // Get the demande
        restDemandeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingDemande() throws Exception {
        // Initialize the database
        insertedDemande = demandeRepository.saveAndFlush(demande);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the demande
        Demande updatedDemande = demandeRepository.findById(demande.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedDemande are not directly saved in db
        em.detach(updatedDemande);
        updatedDemande
            .description(UPDATED_DESCRIPTION)
            .typeBesoin(UPDATED_TYPE_BESOIN)
            .geolocalisation(UPDATED_GEOLOCALISATION)
            .statut(UPDATED_STATUT)
            .isArchived(UPDATED_IS_ARCHIVED);

        restDemandeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDemande.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedDemande))
            )
            .andExpect(status().isOk());

        // Validate the Demande in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedDemandeToMatchAllProperties(updatedDemande);
    }

    @Test
    @Transactional
    void putNonExistingDemande() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        demande.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDemandeMockMvc
            .perform(put(ENTITY_API_URL_ID, demande.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(demande)))
            .andExpect(status().isBadRequest());

        // Validate the Demande in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDemande() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        demande.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDemandeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(demande))
            )
            .andExpect(status().isBadRequest());

        // Validate the Demande in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDemande() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        demande.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDemandeMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(demande)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Demande in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDemandeWithPatch() throws Exception {
        // Initialize the database
        insertedDemande = demandeRepository.saveAndFlush(demande);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the demande using partial update
        Demande partialUpdatedDemande = new Demande();
        partialUpdatedDemande.setId(demande.getId());

        partialUpdatedDemande.statut(UPDATED_STATUT).isArchived(UPDATED_IS_ARCHIVED);

        restDemandeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDemande.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedDemande))
            )
            .andExpect(status().isOk());

        // Validate the Demande in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertDemandeUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedDemande, demande), getPersistedDemande(demande));
    }

    @Test
    @Transactional
    void fullUpdateDemandeWithPatch() throws Exception {
        // Initialize the database
        insertedDemande = demandeRepository.saveAndFlush(demande);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the demande using partial update
        Demande partialUpdatedDemande = new Demande();
        partialUpdatedDemande.setId(demande.getId());

        partialUpdatedDemande
            .description(UPDATED_DESCRIPTION)
            .typeBesoin(UPDATED_TYPE_BESOIN)
            .geolocalisation(UPDATED_GEOLOCALISATION)
            .statut(UPDATED_STATUT)
            .isArchived(UPDATED_IS_ARCHIVED);

        restDemandeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDemande.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedDemande))
            )
            .andExpect(status().isOk());

        // Validate the Demande in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertDemandeUpdatableFieldsEquals(partialUpdatedDemande, getPersistedDemande(partialUpdatedDemande));
    }

    @Test
    @Transactional
    void patchNonExistingDemande() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        demande.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDemandeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, demande.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(demande))
            )
            .andExpect(status().isBadRequest());

        // Validate the Demande in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDemande() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        demande.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDemandeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(demande))
            )
            .andExpect(status().isBadRequest());

        // Validate the Demande in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDemande() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        demande.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDemandeMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(demande)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Demande in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDemande() throws Exception {
        // Initialize the database
        insertedDemande = demandeRepository.saveAndFlush(demande);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the demande
        restDemandeMockMvc
            .perform(delete(ENTITY_API_URL_ID, demande.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return demandeRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected Demande getPersistedDemande(Demande demande) {
        return demandeRepository.findById(demande.getId()).orElseThrow();
    }

    protected void assertPersistedDemandeToMatchAllProperties(Demande expectedDemande) {
        assertDemandeAllPropertiesEquals(expectedDemande, getPersistedDemande(expectedDemande));
    }

    protected void assertPersistedDemandeToMatchUpdatableProperties(Demande expectedDemande) {
        assertDemandeAllUpdatablePropertiesEquals(expectedDemande, getPersistedDemande(expectedDemande));
    }
}
