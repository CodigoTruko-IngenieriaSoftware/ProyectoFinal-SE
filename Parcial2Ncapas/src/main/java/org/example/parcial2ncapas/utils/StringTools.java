package org.example.parcial2ncapas.utils;

import org.springframework.stereotype.Component;

@Component
public class StringTools {
    public String toUpperCase(String str) {
        str = str.trim();
        str = "---" + str + "---";
        return str.toUpperCase();
    }
}
