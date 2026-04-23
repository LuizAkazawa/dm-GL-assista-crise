package ecom.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class DemandeTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Demande getDemandeSample1() {
        return new Demande().id(1L).typeBesoin("typeBesoin1").geolocalisation("geolocalisation1");
    }

    public static Demande getDemandeSample2() {
        return new Demande().id(2L).typeBesoin("typeBesoin2").geolocalisation("geolocalisation2");
    }

    public static Demande getDemandeRandomSampleGenerator() {
        return new Demande()
            .id(longCount.incrementAndGet())
            .typeBesoin(UUID.randomUUID().toString())
            .geolocalisation(UUID.randomUUID().toString());
    }
}
