#!/bin/bash

find ../daw/src/          -name '*.js' -not -name '*.html.js'  -exec wc -l {} \; | cut -d' ' -f1 | awk '{s+=$1} END {printf "* daw              %5.0f JS lines\n", s}'
find ../daw/src/          -name '*.css'                        -exec wc -l {} \; | cut -d' ' -f1 | awk '{s+=$1} END {printf "                   %5.0f CSS lines\n", s}'
find ../daw/src/          -name '*.html.js' -or -name '*.html' -exec wc -l {} \; | cut -d' ' -f1 | awk '{s+=$1} END {printf "                   %5.0f HTML lines\n\n", s}'
find ../daw-core/         -name '*.js'                         -exec wc -l {} \; | cut -d' ' -f1 | awk '{s+=$1} END {printf "* daw-core         %5.0f JS lines\n\n", s}'
find ../gs-utils/         -name '*.js'                         -exec wc -l {} \; | cut -d' ' -f1 | awk '{s+=$1} END {printf "* gs-utils         %5.0f JS lines\n\n", s}'
find ../gs-components/    -name '*.js'                         -exec wc -l {} \; | cut -d' ' -f1 | awk '{s+=$1} END {printf "* gs-component     %5.0f JS lines\n\n", s}'
find ../gs-wa-components/ -name '*.js'                         -exec wc -l {} \; | cut -d' ' -f1 | awk '{s+=$1} END {printf "* gs-wa-components %5.0f JS lines\n\n", s}'
find ../gs-ui-components/ -name '*.js' -not -name '*.html.js'  -exec wc -l {} \; | cut -d' ' -f1 | awk '{s+=$1} END {printf "* gs-ui-components %5.0f JS lines\n", s}'
find ../gs-ui-components/ -name '*.css'                        -exec wc -l {} \; | cut -d' ' -f1 | awk '{s+=$1} END {printf "                   %5.0f CSS lines\n", s}'
find ../gs-ui-components/ -name '*.html.js'                    -exec wc -l {} \; | cut -d' ' -f1 | awk '{s+=$1} END {printf "                   %5.0f HTML lines\n", s}'
