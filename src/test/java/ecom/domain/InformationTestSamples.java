package ecom.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class InformationTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Information getInformationSample1() {
        return new Information().id(1L);
    }

    public static Information getInformationSample2() {
        return new Information().id(2L);
    }

    public static Information getInformationRandomSampleGenerator() {
        return new Information().id(longCount.incrementAndGet());
    }
}
