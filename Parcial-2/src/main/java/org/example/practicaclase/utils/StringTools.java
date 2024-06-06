package org.example.practicaclase.utils;

import org.springframework.stereotype.Component;

@Component
public class StringTools {
    public String toUpperCase(String str) {
        str = str.trim();
        str = "---" + str + "---";
        return str.toUpperCase();
    }
}
