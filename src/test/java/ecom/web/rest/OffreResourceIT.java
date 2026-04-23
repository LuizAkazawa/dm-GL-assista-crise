package ecom.web.rest;

import static ecom.domain.OffreAsserts.*;
import static ecom.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import ecom.IntegrationTest;
import ecom.domain.Offre;
import ecom.repository.OffreRepository;
import ecom.service.OffreService;
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
 * Integration tests for the {@link OffreResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class OffreResourceIT {

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_GEOLOCALISATION = "AAAAAAAAAA";
    private static final String UPDATED_GEOLOCALISATION = "BBBBBBBBBB";

    private static final Boolean DEFAULT_IS_ARCHIVED = false;
    private static final Boolean UPDATED_IS_ARCHIVED = true;

    private static final String ENTITY_API_URL = "/api/offres";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private OffreRepository offreRepository;

    @Mock
    private OffreRepository offreRepositoryMock;

    @Mock
    private OffreService offreServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOffreMockMvc;

    private Offre offre;

    private Offre insertedOffre;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Offre createEntity() {
        return new Offre().description(DEFAULT_DESCRIPTION).geolocalisation(DEFAULT_GEOLOCALISATION).isArchived(DEFAULT_IS_ARCHIVED);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Offre createUpdatedEntity() {
        return new Offre().description(UPDATED_DESCRIPTION).geolocalisation(UPDATED_GEOLOCALISATION).isArchived(UPDATED_IS_ARCHIVED);
    }

    @BeforeEach
    void initTest() {
        offre = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedOffre != null) {
            offreRepository.delete(insertedOffre);
            insertedOffre = null;
        }
    }

    @Test
    @Transactional
    void createOffre() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Offre
        var returnedOffre = om.readValue(
            restOffreMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(offre)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Offre.class
        );

        // Validate the Offre in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertOffreUpdatableFieldsEquals(returnedOffre, getPersistedOffre(returnedOffre));

        insertedOffre = returnedOffre;
    }

    @Test
    @Transactional
    void createOffreWithExistingId() throws Exception {
        // Create the Offre with an existing ID
        offre.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restOffreMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(offre)))
            .andExpect(status().isBadRequest());

        // Validate the Offre in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkGeolocalisationIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        offre.setGeolocalisation(null);

        // Create the Offre, which fails.

        restOffreMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(offre)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllOffres() throws Exception {
        // Initialize the database
        insertedOffre = offreRepository.saveAndFlush(offre);

        // Get all the offreList
        restOffreMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(offre.getId().intValue())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].geolocalisation").value(hasItem(DEFAULT_GEOLOCALISATION)))
            .andExpect(jsonPath("$.[*].isArchived").value(hasItem(DEFAULT_IS_ARCHIVED)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllOffresWithEagerRelationshipsIsEnabled() throws Exception {
        when(offreServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restOffreMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(offreServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllOffresWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(offreServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restOffreMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(offreRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getOffre() throws Exception {
        // Initialize the database
        insertedOffre = offreRepository.saveAndFlush(offre);

        // Get the offre
        restOffreMockMvc
            .perform(get(ENTITY_API_URL_ID, offre.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(offre.getId().intValue()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.geolocalisation").value(DEFAULT_GEOLOCALISATION))
            .andExpect(jsonPath("$.isArchived").value(DEFAULT_IS_ARCHIVED));
    }

    @Test
    @Transactional
    void getNonExistingOffre() throws Exception {
        // Get the offre
        restOffreMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingOffre() throws Exception {
        // Initialize the database
        insertedOffre = offreRepository.saveAndFlush(offre);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the offre
        Offre updatedOffre = offreRepository.findById(offre.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedOffre are not directly saved in db
        em.detach(updatedOffre);
        updatedOffre.description(UPDATED_DESCRIPTION).geolocalisation(UPDATED_GEOLOCALISATION).isArchived(UPDATED_IS_ARCHIVED);

        restOffreMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedOffre.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedOffre))
            )
            .andExpect(status().isOk());

        // Validate the Offre in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedOffreToMatchAllProperties(updatedOffre);
    }

    @Test
    @Transactional
    void putNonExistingOffre() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        offre.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOffreMockMvc
            .perform(put(ENTITY_API_URL_ID, offre.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(offre)))
            .andExpect(status().isBadRequest());

        // Validate the Offre in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchOffre() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        offre.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOffreMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(offre))
            )
            .andExpect(status().isBadRequest());

        // Validate the Offre in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamOffre() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        offre.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOffreMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(offre)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Offre in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateOffreWithPatch() throws Exception {
        // Initialize the database
        insertedOffre = offreRepository.saveAndFlush(offre);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the offre using partial update
        Offre partialUpdatedOffre = new Offre();
        partialUpdatedOffre.setId(offre.getId());

        partialUpdatedOffre.geolocalisation(UPDATED_GEOLOCALISATION).isArchived(UPDATED_IS_ARCHIVED);

        restOffreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOffre.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedOffre))
            )
            .andExpect(status().isOk());

        // Validate the Offre in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertOffreUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedOffre, offre), getPersistedOffre(offre));
    }

    @Test
    @Transactional
    void fullUpdateOffreWithPatch() throws Exception {
        // Initialize the database
        insertedOffre = offreRepository.saveAndFlush(offre);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the offre using partial update
        Offre partialUpdatedOffre = new Offre();
        partialUpdatedOffre.setId(offre.getId());

        partialUpdatedOffre.description(UPDATED_DESCRIPTION).geolocalisation(UPDATED_GEOLOCALISATION).isArchived(UPDATED_IS_ARCHIVED);

        restOffreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOffre.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedOffre))
            )
            .andExpect(status().isOk());

        // Validate the Offre in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertOffreUpdatableFieldsEquals(partialUpdatedOffre, getPersistedOffre(partialUpdatedOffre));
    }

    @Test
    @Transactional
    void patchNonExistingOffre() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        offre.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOffreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, offre.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(offre))
            )
            .andExpect(status().isBadRequest());

        // Validate the Offre in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchOffre() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        offre.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOffreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(offre))
            )
            .andExpect(status().isBadRequest());

        // Validate the Offre in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamOffre() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        offre.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOffreMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(offre)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Offre in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteOffre() throws Exception {
        // Initialize the database
        insertedOffre = offreRepository.saveAndFlush(offre);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the offre
        restOffreMockMvc
            .perform(delete(ENTITY_API_URL_ID, offre.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return offreRepository.count();
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

    protected Offre getPersistedOffre(Offre offre) {
        return offreRepository.findById(offre.getId()).orElseThrow();
    }

    protected void assertPersistedOffreToMatchAllProperties(Offre expectedOffre) {
        assertOffreAllPropertiesEquals(expectedOffre, getPersistedOffre(expectedOffre));
    }

    protected void assertPersistedOffreToMatchUpdatableProperties(Offre expectedOffre) {
        assertOffreAllUpdatablePropertiesEquals(expectedOffre, getPersistedOffre(expectedOffre));
    }
}
