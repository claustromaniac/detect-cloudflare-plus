#!/bin/bash

colors="red:#cc0000 green:#00cc00 orange:#ddaa00 grey:#cccccc"

for res in 16 32 64; do
    for color in ${colors}; do
        colname=${color%:*}
        colspec=${color#*:}
        convert -background none cf.svg \
                +level-colors "${colspec}," \
                -colorspace RGB \
                -resize "${res}" \
                -colorspace sRGB \
                "cf-${colname}-${res}.png"
    done
done

