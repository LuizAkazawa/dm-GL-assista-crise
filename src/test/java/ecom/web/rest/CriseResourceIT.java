package ecom.web.rest;

import static ecom.domain.CriseAsserts.*;
import static ecom.web.rest.TestUtil.createUpdateProxyForBean;
import static ecom.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import ecom.IntegrationTest;
import ecom.domain.Crise;
import ecom.domain.enumeration.TypeCrise;
import ecom.repository.CriseRepository;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link CriseResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CriseResourceIT {

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final TypeCrise DEFAULT_NATURE = TypeCrise.FEU_DE_FORET;
    private static final TypeCrise UPDATED_NATURE = TypeCrise.INONDATION;

    private static final ZonedDateTime DEFAULT_DATE_DEBUT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE_DEBUT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_DATE_FIN = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE_FIN = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Boolean DEFAULT_IS_ACTIVE = false;
    private static final Boolean UPDATED_IS_ACTIVE = true;

    private static final String ENTITY_API_URL = "/api/crises";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private CriseRepository criseRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCriseMockMvc;

    private Crise crise;

    private Crise insertedCrise;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Crise createEntity() {
        return new Crise()
            .nom(DEFAULT_NOM)
            .nature(DEFAULT_NATURE)
            .dateDebut(DEFAULT_DATE_DEBUT)
            .dateFin(DEFAULT_DATE_FIN)
            .isActive(DEFAULT_IS_ACTIVE);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Crise createUpdatedEntity() {
        return new Crise()
            .nom(UPDATED_NOM)
            .nature(UPDATED_NATURE)
            .dateDebut(UPDATED_DATE_DEBUT)
            .dateFin(UPDATED_DATE_FIN)
            .isActive(UPDATED_IS_ACTIVE);
    }

    @BeforeEach
    void initTest() {
        crise = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedCrise != null) {
            criseRepository.delete(insertedCrise);
            insertedCrise = null;
        }
    }

    @Test
    @Transactional
    void createCrise() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Crise
        var returnedCrise = om.readValue(
            restCriseMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(crise)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Crise.class
        );

        // Validate the Crise in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertCriseUpdatableFieldsEquals(returnedCrise, getPersistedCrise(returnedCrise));

        insertedCrise = returnedCrise;
    }

    @Test
    @Transactional
    void createCriseWithExistingId() throws Exception {
        // Create the Crise with an existing ID
        crise.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCriseMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(crise)))
            .andExpect(status().isBadRequest());

        // Validate the Crise in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNomIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        crise.setNom(null);

        // Create the Crise, which fails.

        restCriseMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(crise)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkNatureIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        crise.setNature(null);

        // Create the Crise, which fails.

        restCriseMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(crise)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDateDebutIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        crise.setDateDebut(null);

        // Create the Crise, which fails.

        restCriseMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(crise)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllCrises() throws Exception {
        // Initialize the database
        insertedCrise = criseRepository.saveAndFlush(crise);

        // Get all the criseList
        restCriseMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(crise.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].nature").value(hasItem(DEFAULT_NATURE.toString())))
            .andExpect(jsonPath("$.[*].dateDebut").value(hasItem(sameInstant(DEFAULT_DATE_DEBUT))))
            .andExpect(jsonPath("$.[*].dateFin").value(hasItem(sameInstant(DEFAULT_DATE_FIN))))
            .andExpect(jsonPath("$.[*].isActive").value(hasItem(DEFAULT_IS_ACTIVE)));
    }

    @Test
    @Transactional
    void getCrise() throws Exception {
        // Initialize the database
        insertedCrise = criseRepository.saveAndFlush(crise);

        // Get the crise
        restCriseMockMvc
            .perform(get(ENTITY_API_URL_ID, crise.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(crise.getId().intValue()))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM))
            .andExpect(jsonPath("$.nature").value(DEFAULT_NATURE.toString()))
            .andExpect(jsonPath("$.dateDebut").value(sameInstant(DEFAULT_DATE_DEBUT)))
            .andExpect(jsonPath("$.dateFin").value(sameInstant(DEFAULT_DATE_FIN)))
            .andExpect(jsonPath("$.isActive").value(DEFAULT_IS_ACTIVE));
    }

    @Test
    @Transactional
    void getNonExistingCrise() throws Exception {
        // Get the crise
        restCriseMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCrise() throws Exception {
        // Initialize the database
        insertedCrise = criseRepository.saveAndFlush(crise);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the crise
        Crise updatedCrise = criseRepository.findById(crise.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedCrise are not directly saved in db
        em.detach(updatedCrise);
        updatedCrise
            .nom(UPDATED_NOM)
            .nature(UPDATED_NATURE)
            .dateDebut(UPDATED_DATE_DEBUT)
            .dateFin(UPDATED_DATE_FIN)
            .isActive(UPDATED_IS_ACTIVE);

        restCriseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCrise.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedCrise))
            )
            .andExpect(status().isOk());

        // Validate the Crise in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedCriseToMatchAllProperties(updatedCrise);
    }

    @Test
    @Transactional
    void putNonExistingCrise() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        crise.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCriseMockMvc
            .perform(put(ENTITY_API_URL_ID, crise.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(crise)))
            .andExpect(status().isBadRequest());

        // Validate the Crise in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCrise() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        crise.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCriseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(crise))
            )
            .andExpect(status().isBadRequest());

        // Validate the Crise in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCrise() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        crise.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCriseMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(crise)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Crise in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCriseWithPatch() throws Exception {
        // Initialize the database
        insertedCrise = criseRepository.saveAndFlush(crise);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the crise using partial update
        Crise partialUpdatedCrise = new Crise();
        partialUpdatedCrise.setId(crise.getId());

        partialUpdatedCrise.dateDebut(UPDATED_DATE_DEBUT).dateFin(UPDATED_DATE_FIN).isActive(UPDATED_IS_ACTIVE);

        restCriseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCrise.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedCrise))
            )
            .andExpect(status().isOk());

        // Validate the Crise in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertCriseUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedCrise, crise), getPersistedCrise(crise));
    }

    @Test
    @Transactional
    void fullUpdateCriseWithPatch() throws Exception {
        // Initialize the database
        insertedCrise = criseRepository.saveAndFlush(crise);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the crise using partial update
        Crise partialUpdatedCrise = new Crise();
        partialUpdatedCrise.setId(crise.getId());

        partialUpdatedCrise
            .nom(UPDATED_NOM)
            .nature(UPDATED_NATURE)
            .dateDebut(UPDATED_DATE_DEBUT)
            .dateFin(UPDATED_DATE_FIN)
            .isActive(UPDATED_IS_ACTIVE);

        restCriseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCrise.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedCrise))
            )
            .andExpect(status().isOk());

        // Validate the Crise in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertCriseUpdatableFieldsEquals(partialUpdatedCrise, getPersistedCrise(partialUpdatedCrise));
    }

    @Test
    @Transactional
    void patchNonExistingCrise() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        crise.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCriseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, crise.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(crise))
            )
            .andExpect(status().isBadRequest());

        // Validate the Crise in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCrise() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        crise.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCriseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(crise))
            )
            .andExpect(status().isBadRequest());

        // Validate the Crise in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCrise() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        crise.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCriseMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(crise)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Crise in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCrise() throws Exception {
        // Initialize the database
        insertedCrise = criseRepository.saveAndFlush(crise);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the crise
        restCriseMockMvc
            .perform(delete(ENTITY_API_URL_ID, crise.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return criseRepository.count();
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

    protected Crise getPersistedCrise(Crise crise) {
        return criseRepository.findById(crise.getId()).orElseThrow();
    }

    protected void assertPersistedCriseToMatchAllProperties(Crise expectedCrise) {
        assertCriseAllPropertiesEquals(expectedCrise, getPersistedCrise(expectedCrise));
    }

    protected void assertPersistedCriseToMatchUpdatableProperties(Crise expectedCrise) {
        assertCriseAllUpdatablePropertiesEquals(expectedCrise, getPersistedCrise(expectedCrise));
    }
}
