package ecom.domain;

import static ecom.domain.CriseTestSamples.*;
import static ecom.domain.UtilisateurTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import ecom.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class CriseTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Crise.class);
        Crise crise1 = getCriseSample1();
        Crise crise2 = new Crise();
        assertThat(crise1).isNotEqualTo(crise2);

        crise2.setId(crise1.getId());
        assertThat(crise1).isEqualTo(crise2);

        crise2 = getCriseSample2();
        assertThat(crise1).isNotEqualTo(crise2);
    }

    @Test
    void sinistreTest() {
        Crise crise = getCriseRandomSampleGenerator();
        Utilisateur utilisateurBack = getUtilisateurRandomSampleGenerator();

        crise.addSinistre(utilisateurBack);
        assertThat(crise.getSinistres()).containsOnly(utilisateurBack);
        assertThat(utilisateurBack.getCriseTouchees()).containsOnly(crise);

        crise.removeSinistre(utilisateurBack);
        assertThat(crise.getSinistres()).doesNotContain(utilisateurBack);
        assertThat(utilisateurBack.getCriseTouchees()).doesNotContain(crise);

        crise.sinistres(new HashSet<>(Set.of(utilisateurBack)));
        assertThat(crise.getSinistres()).containsOnly(utilisateurBack);
        assertThat(utilisateurBack.getCriseTouchees()).containsOnly(crise);

        crise.setSinistres(new HashSet<>());
        assertThat(crise.getSinistres()).doesNotContain(utilisateurBack);
        assertThat(utilisateurBack.getCriseTouchees()).doesNotContain(crise);
    }
}
