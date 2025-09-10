// ==================================================================
// PASTE THE 'stimuli' ARRAY GENERATED FROM YOUR CSV FILE HERE
// ==================================================================

const stimuli = [
    {
        type: 'text',
        block_name: 'Text-Only, Range 0.1_0.5',
        true_value: 0.2498,
        ascii_art: `|-=-=-----                               |
|-------------------------.------ -------|`
    },
    {
        type: 'text',
        block_name: 'Text-Only, Range 0.1_0.5',
        true_value: 0.4803,
        ascii_art: `|------------.-~----                     |
|-------------.~-------------------------|`
    },
    //     {
    //         type: 'text',
    //         block_name: 'Text-Only, Range 0.1_0.5',
    //         true_value: 0.3928,
    //         ascii_art: `|-----~---=-----                         |
    // |---------------------------=------~-----|`
    //     },
    //     {
    //         type: 'text',
    //         block_name: 'Text-Only, Range 0.1_0.5',
    //         true_value: 0.3395,
    //         ascii_art: `|----------~-                            |
    // |--------- -------------=----------------|`
    //     },
    //     {
    //         type: 'text',
    //         block_name: 'Text-Only, Range 0.1_0.5',
    //         true_value: 0.1624,
    //         ascii_art: `|-----                                   |
    // |------------------------- ------ -------|`
    //     },
    //     {
    //         type: 'text',
    //         block_name: 'Text-Only, Range 0.1_0.5',
    //         true_value: 0.1624,
    //         ascii_art: `|---.-.                                  |
    // |------------------=-------------.-------|`
    //     },
    //     {
    //         type: 'text',
    //         block_name: 'Text-Only, Range 0.1_0.5',
    //         true_value: 0.1232,
    //         ascii_art: `|.-~-                                    |
    // |-----=---------.------------------------|`
    //     },
    //     {
    //         type: 'text',
    //         block_name: 'Text-Only, Range 0.1_0.5',
    //         true_value: 0.4465,
    //         ascii_art: `|- -------.-------                       |
    // |-----=---------------------------------.|`
    //     },
    //     {
    //         type: 'text',
    //         block_name: 'Text-Only, Range 0.1_0.5',
    //         true_value: 0.3404,
    //         ascii_art: `|--- =--------                           |
    // |------.---------------------~-----------|`
    //     },
    //     {
    //         type: 'text',
    //         block_name: 'Text-Only, Range 0.1_0.5',
    //         true_value: 0.3832,
    //         ascii_art: `|------ ------.-                         |
    // |------------------~---------- ----------|`
    //     },
    {
        type: 'instruction',
        title: 'Next Block',
        text: 'You have completed the previous block. The next set of trials will now begin.'
    },
    {
        type: 'text',
        block_name: 'Text-Only, Range 0.3_0.8',
        true_value: 0.4873,
        ascii_art: `|--=------.---------                     |
    |-----------.----------------------------|`
    },
    //     {
    //         type: 'text',
    //         block_name: 'Text-Only, Range 0.3_0.8',
    //         true_value: 0.7754,
    //         ascii_art: `|------=---------------~--------         |
    // |------=- -------------------------------|`
    //     },
    //     {
    //         type: 'text',
    //         block_name: 'Text-Only, Range 0.3_0.8',
    //         true_value: 0.666,
    //         ascii_art: `|--------------~~----------              |
    // |----~------- ---------------------------|`
    //     },
    //     {
    //         type: 'text',
    //         block_name: 'Text-Only, Range 0.3_0.8',
    //         true_value: 0.5993,
    //         ascii_art: `|-~-------------------=-                 |
    // |--.-------- ----------------------------|`
    //     },
    //     {
    //         type: 'text',
    //         block_name: 'Text-Only, Range 0.3_0.8',
    //         true_value: 0.378,
    //         ascii_art: `|----.--------~-                         |
    // |-----------------------.--.-------------|`
    //     },
    //     {
    //         type: 'text',
    //         block_name: 'Text-Only, Range 0.3_0.8',
    //         true_value: 0.378,
    //         ascii_art: `|---------=--~--                         |
    // |---------------=---------=--------------|`
    //     },
    //     {
    //         type: 'text',
    //         block_name: 'Text-Only, Range 0.3_0.8',
    //         true_value: 0.329,
    //         ascii_art: `|------------~                           |
    // |----------.------------.----------------|`
    //     },
    //     {
    //         type: 'text',
    //         block_name: 'Text-Only, Range 0.3_0.8',
    //         true_value: 0.7331,
    //         ascii_art: `|------------------=-----=----           |
    // |-----~---------~------------------------|`
    //     },
    //     {
    //         type: 'text',
    //         block_name: 'Text-Only, Range 0.3_0.8',
    //         true_value: 0.6006,
    //         ascii_art: `|--------=--------------                 |
    // |-----------=------------- --------------|`
    //     },
    //     {
    //         type: 'text',
    //         block_name: 'Text-Only, Range 0.3_0.8',
    //         true_value: 0.654,
    //         ascii_art: `|-----------------------~-.              |
    // |-----=---------------------------------.|`
    //     },
    //     {
    //         type: 'instruction',
    //         title: 'Next Block',
    //         text: 'You have completed the previous block. The next set of trials will now begin.'
    //     },
    //     {
    //         type: 'text',
    //         block_name: 'Text-Only, Range 0.5_0.9',
    //         true_value: 0.6498,
    //         ascii_art: `| ------------- ----------               |
    // |--------=---~---------------------------|`
    //     },
    //     {
    //         type: 'text',
    //         block_name: 'Text-Only, Range 0.5_0.9',
    //         true_value: 0.8803,
    //         ascii_art: `|--- ---------------------.---------     |
    // |------------------------------ --- -----|`
    //     },
    //     {
    //         type: 'text',
    //         block_name: 'Text-Only, Range 0.5_0.9',
    //         true_value: 0.7928,
    //         ascii_art: `|~----------------------------~-         |
    // |.--- -----------------------------------|`
    //     },
    //     {
    //         type: 'text',
    //         block_name: 'Text-Only, Range 0.5_0.9',
    //         true_value: 0.7395,
    //         ascii_art: `|-=----------------------=----           |
    // |---~--------~---------------------------|`
    //     },
    //     {
    //         type: 'text',
    //         block_name: 'Text-Only, Range 0.5_0.9',
    //         true_value: 0.5624,
    //         ascii_art: `|-- ---------~---------                  |
    // |--- -----------------------------.------|`
    //     },
    //     {
    //         type: 'text',
    //         block_name: 'Text-Only, Range 0.5_0.9',
    //         true_value: 0.5624,
    //         ascii_art: `|---------- ---------=-                  |
    // |-- -------------------------------- ----|`
    //     },
    //     {
    //         type: 'text',
    //         block_name: 'Text-Only, Range 0.5_0.9',
    //         true_value: 0.5232,
    //         ascii_art: `|------~----------- -                    |
    // |--------.---.---------------------------|`
    //     },
    //     {
    //         type: 'text',
    //         block_name: 'Text-Only, Range 0.5_0.9',
    //         true_value: 0.8465,
    //         ascii_art: `|----------- -------=-------------       |
    // |---------.--- --------------------------|`
    //     },
    //     {
    //         type: 'text',
    //         block_name: 'Text-Only, Range 0.5_0.9',
    //         true_value: 0.7404,
    //         ascii_art: `|--=-------=------------------           |
    // |--------------------------- ------------|`
    //     },
    //     {
    //         type: 'text',
    //         block_name: 'Text-Only, Range 0.5_0.9',
    //         true_value: 0.7832,
    //         ascii_art: `|---------=-----------------~---         |
    // |------=------=--------------------------|`
    //     },
    //     {
    //         type: 'instruction',
    //         title: 'Next Block',
    //         text: 'You have completed the previous block. The next set of trials will now begin.'
    //     },
    //     {
    //         type: 'image',
    //         block_name: 'Image-Only, Range 0.1_0.5',
    //         true_value: 0.2498,
    //         image_path: 'images/sample_000_0.2498.png'
    //     },
    //     {
    //         type: 'image',
    //         block_name: 'Image-Only, Range 0.1_0.5',
    //         true_value: 0.4803,
    //         image_path: 'images/sample_001_0.4803.png'
    //     },
    //     {
    //         type: 'image',
    //         block_name: 'Image-Only, Range 0.1_0.5',
    //         true_value: 0.3928,
    //         image_path: 'images/sample_002_0.3928.png'
    //     },
    //     {
    //         type: 'image',
    //         block_name: 'Image-Only, Range 0.1_0.5',
    //         true_value: 0.3395,
    //         image_path: 'images/sample_003_0.3395.png'
    //     },
    //     {
    //         type: 'image',
    //         block_name: 'Image-Only, Range 0.1_0.5',
    //         true_value: 0.1624,
    //         image_path: 'images/sample_004_0.1624.png'
    //     },
    //     {
    //         type: 'image',
    //         block_name: 'Image-Only, Range 0.1_0.5',
    //         true_value: 0.1624,
    //         image_path: 'images/sample_005_0.1624.png'
    //     },
    //     {
    //         type: 'image',
    //         block_name: 'Image-Only, Range 0.1_0.5',
    //         true_value: 0.1232,
    //         image_path: 'images/sample_006_0.1232.png'
    //     },
    //     {
    //         type: 'image',
    //         block_name: 'Image-Only, Range 0.1_0.5',
    //         true_value: 0.4465,
    //         image_path: 'images/sample_007_0.4465.png'
    //     },
    //     {
    //         type: 'image',
    //         block_name: 'Image-Only, Range 0.1_0.5',
    //         true_value: 0.3404,
    //         image_path: 'images/sample_008_0.3404.png'
    //     },
    //     {
    //         type: 'image',
    //         block_name: 'Image-Only, Range 0.1_0.5',
    //         true_value: 0.3832,
    //         image_path: 'images/sample_009_0.3832.png'
    //     },
    //     {
    //         type: 'instruction',
    //         title: 'Next Block',
    //         text: 'You have completed the previous block. The next set of trials will now begin.'
    //     },
    //     {
    //         type: 'image',
    //         block_name: 'Image-Only, Range 0.3_0.8',
    //         true_value: 0.4873,
    //         image_path: 'images/sample_000_0.4873.png'
    //     },
    //     {
    //         type: 'image',
    //         block_name: 'Image-Only, Range 0.3_0.8',
    //         true_value: 0.7754,
    //         image_path: 'images/sample_001_0.7754.png'
    //     },
    //     {
    //         type: 'image',
    //         block_name: 'Image-Only, Range 0.3_0.8',
    //         true_value: 0.666,
    //         image_path: 'images/sample_002_0.666.png'
    //     },
    //     {
    //         type: 'image',
    //         block_name: 'Image-Only, Range 0.3_0.8',
    //         true_value: 0.5993,
    //         image_path: 'images/sample_003_0.5993.png'
    //     },
    //     {
    //         type: 'image',
    //         block_name: 'Image-Only, Range 0.3_0.8',
    //         true_value: 0.378,
    //         image_path: 'images/sample_004_0.378.png'
    //     },
    //     {
    //         type: 'image',
    //         block_name: 'Image-Only, Range 0.3_0.8',
    //         true_value: 0.378,
    //         image_path: 'images/sample_005_0.378.png'
    //     },
    //     {
    //         type: 'image',
    //         block_name: 'Image-Only, Range 0.3_0.8',
    //         true_value: 0.329,
    //         image_path: 'images/sample_006_0.329.png'
    //     },
    //     {
    //         type: 'image',
    //         block_name: 'Image-Only, Range 0.3_0.8',
    //         true_value: 0.7331,
    //         image_path: 'images/sample_007_0.7331.png'
    //     },
    //     {
    //         type: 'image',
    //         block_name: 'Image-Only, Range 0.3_0.8',
    //         true_value: 0.6006,
    //         image_path: 'images/sample_008_0.6006.png'
    //     },
    //     {
    //         type: 'image',
    //         block_name: 'Image-Only, Range 0.3_0.8',
    //         true_value: 0.654,
    //         image_path: 'images/sample_009_0.654.png'
    //     },
    //     {
    //         type: 'instruction',
    //         title: 'Next Block',
    //         text: 'You have completed the previous block. The next set of trials will now begin.'
    //     },
    //     {
    //         type: 'image',
    //         block_name: 'Image-Only, Range 0.5_0.9',
    //         true_value: 0.6498,
    //         image_path: 'images/sample_000_0.6498.png'
    //     },
    //     {
    //         type: 'image',
    //         block_name: 'Image-Only, Range 0.5_0.9',
    //         true_value: 0.8803,
    //         image_path: 'images/sample_001_0.8803.png'
    //     },
    //     {
    //         type: 'image',
    //         block_name: 'Image-Only, Range 0.5_0.9',
    //         true_value: 0.7928,
    //         image_path: 'images/sample_002_0.7928.png'
    //     },
    //     {
    //         type: 'image',
    //         block_name: 'Image-Only, Range 0.5_0.9',
    //         true_value: 0.7395,
    //         image_path: 'images/sample_003_0.7395.png'
    //     },
    //     {
    //         type: 'image',
    //         block_name: 'Image-Only, Range 0.5_0.9',
    //         true_value: 0.5624,
    //         image_path: 'images/sample_004_0.5624.png'
    //     },
    //     {
    //         type: 'image',
    //         block_name: 'Image-Only, Range 0.5_0.9',
    //         true_value: 0.5624,
    //         image_path: 'images/sample_005_0.5624.png'
    //     },
    //     {
    //         type: 'image',
    //         block_name: 'Image-Only, Range 0.5_0.9',
    //         true_value: 0.5232,
    //         image_path: 'images/sample_006_0.5232.png'
    //     },
    //     {
    //         type: 'image',
    //         block_name: 'Image-Only, Range 0.5_0.9',
    //         true_value: 0.8465,
    //         image_path: 'images/sample_007_0.8465.png'
    //     },
    //     {
    //         type: 'image',
    //         block_name: 'Image-Only, Range 0.5_0.9',
    //         true_value: 0.7404,
    //         image_path: 'images/sample_008_0.7404.png'
    //     },
    //     {
    //         type: 'image',
    //         block_name: 'Image-Only, Range 0.5_0.9',
    //         true_value: 0.7832,
    //         image_path: 'images/sample_009_0.7832.png'
    //     },
    //     {
    //         type: 'instruction',
    //         title: 'Next Block',
    //         text: 'You have completed the previous block. The next set of trials will now begin.'
    //     },
    //     {
    //         type: 'both',
    //         block_name: 'Text + Image, Range 0.1_0.5',
    //         true_value: 0.2498,
    //         ascii_art: `|-=-=-----                               |
    // |-------------------------.------ -------|`,
    //         image_path: 'images/sample_000_0.2498.png'
    //     },
    //     {
    //         type: 'both',
    //         block_name: 'Text + Image, Range 0.1_0.5',
    //         true_value: 0.4803,
    //         ascii_art: `|------------.-~----                     |
    // |-------------.~-------------------------|`,
    //         image_path: 'images/sample_001_0.4803.png'
    //     },
    //     {
    //         type: 'both',
    //         block_name: 'Text + Image, Range 0.1_0.5',
    //         true_value: 0.3928,
    //         ascii_art: `|-----~---=-----                         |
    // |---------------------------=------~-----|`,
    //         image_path: 'images/sample_002_0.3928.png'
    //     },
    //     {
    //         type: 'both',
    //         block_name: 'Text + Image, Range 0.1_0.5',
    //         true_value: 0.3395,
    //         ascii_art: `|----------~-                            |
    // |--------- -------------=----------------|`,
    //         image_path: 'images/sample_003_0.3395.png'
    //     },
    //     {
    //         type: 'both',
    //         block_name: 'Text + Image, Range 0.1_0.5',
    //         true_value: 0.1624,
    //         ascii_art: `|-----                                   |
    // |------------------------- ------ -------|`,
    //         image_path: 'images/sample_004_0.1624.png'
    //     },
    //     {
    //         type: 'both',
    //         block_name: 'Text + Image, Range 0.1_0.5',
    //         true_value: 0.1624,
    //         ascii_art: `|---.-.                                  |
    // |------------------=-------------.-------|`,
    //         image_path: 'images/sample_005_0.1624.png'
    //     },
    //     {
    //         type: 'both',
    //         block_name: 'Text + Image, Range 0.1_0.5',
    //         true_value: 0.1232,
    //         ascii_art: `|.-~-                                    |
    // |-----=---------.------------------------|`,
    //         image_path: 'images/sample_006_0.1232.png'
    //     },
    //     {
    //         type: 'both',
    //         block_name: 'Text + Image, Range 0.1_0.5',
    //         true_value: 0.4465,
    //         ascii_art: `|- -------.-------                       |
    // |-----=---------------------------------.|`,
    //         image_path: 'images/sample_007_0.4465.png'
    //     },
    //     {
    //         type: 'both',
    //         block_name: 'Text + Image, Range 0.1_0.5',
    //         true_value: 0.3404,
    //         ascii_art: `|--- =--------                           |
    // |------.---------------------~-----------|`,
    //         image_path: 'images/sample_008_0.3404.png'
    //     },
    //     {
    //         type: 'both',
    //         block_name: 'Text + Image, Range 0.1_0.5',
    //         true_value: 0.3832,
    //         ascii_art: `|------ ------.-                         |
    // |------------------~---------- ----------|`,
    //         image_path: 'images/sample_009_0.3832.png'
    //     },
    //     {
    //         type: 'instruction',
    //         title: 'Next Block',
    //         text: 'You have completed the previous block. The next set of trials will now begin.'
    //     },
    //     {
    //         type: 'both',
    //         block_name: 'Text + Image, Range 0.3_0.8',
    //         true_value: 0.4873,
    //         ascii_art: `|--=------.---------                     |
    // |-----------.----------------------------|`,
    //         image_path: 'images/sample_000_0.4873.png'
    //     },
    //     {
    //         type: 'both',
    //         block_name: 'Text + Image, Range 0.3_0.8',
    //         true_value: 0.7754,
    //         ascii_art: `|------=---------------~--------         |
    // |------=- -------------------------------|`,
    //         image_path: 'images/sample_001_0.7754.png'
    //     },
    //     {
    //         type: 'both',
    //         block_name: 'Text + Image, Range 0.3_0.8',
    //         true_value: 0.666,
    //         ascii_art: `|--------------~~----------              |
    // |----~------- ---------------------------|`,
    //         image_path: 'images/sample_002_0.666.png'
    //     },
    //     {
    //         type: 'both',
    //         block_name: 'Text + Image, Range 0.3_0.8',
    //         true_value: 0.5993,
    //         ascii_art: `|-~-------------------=-                 |
    // |--.-------- ----------------------------|`,
    //         image_path: 'images/sample_003_0.5993.png'
    //     },
    //     {
    //         type: 'both',
    //         block_name: 'Text + Image, Range 0.3_0.8',
    //         true_value: 0.378,
    //         ascii_art: `|----.--------~-                         |
    // |-----------------------.--.-------------|`,
    //         image_path: 'images/sample_004_0.378.png'
    //     },
    //     {
    //         type: 'both',
    //         block_name: 'Text + Image, Range 0.3_0.8',
    //         true_value: 0.378,
    //         ascii_art: `|---------=--~--                         |
    // |---------------=---------=--------------|`,
    //         image_path: 'images/sample_005_0.378.png'
    //     },
    //     {
    //         type: 'both',
    //         block_name: 'Text + Image, Range 0.3_0.8',
    //         true_value: 0.329,
    //         ascii_art: `|------------~                           |
    // |----------.------------.----------------|`,
    //         image_path: 'images/sample_006_0.329.png'
    //     },
    //     {
    //         type: 'both',
    //         block_name: 'Text + Image, Range 0.3_0.8',
    //         true_value: 0.7331,
    //         ascii_art: `|------------------=-----=----           |
    // |-----~---------~------------------------|`,
    //         image_path: 'images/sample_007_0.7331.png'
    //     },
    //     {
    //         type: 'both',
    //         block_name: 'Text + Image, Range 0.3_0.8',
    //         true_value: 0.6006,
    //         ascii_art: `|--------=--------------                 |
    // |-----------=------------- --------------|`,
    //         image_path: 'images/sample_008_0.6006.png'
    //     },
    //     {
    //         type: 'both',
    //         block_name: 'Text + Image, Range 0.3_0.8',
    //         true_value: 0.654,
    //         ascii_art: `|-----------------------~-.              |
    // |-----=---------------------------------.|`,
    //         image_path: 'images/sample_009_0.654.png'
    //     },
    //     {
    //         type: 'instruction',
    //         title: 'Next Block',
    //         text: 'You have completed the previous block. The next set of trials will now begin.'
    //     },
    //     {
    //         type: 'both',
    //         block_name: 'Text + Image, Range 0.5_0.9',
    //         true_value: 0.6498,
    //         ascii_art: `| ------------- ----------               |
    // |--------=---~---------------------------|`,
    //         image_path: 'images/sample_000_0.6498.png'
    //     },
    //     {
    //         type: 'both',
    //         block_name: 'Text + Image, Range 0.5_0.9',
    //         true_value: 0.8803,
    //         ascii_art: `|--- ---------------------.---------     |
    // |------------------------------ --- -----|`,
    //         image_path: 'images/sample_001_0.8803.png'
    //     },
    //     {
    //         type: 'both',
    //         block_name: 'Text + Image, Range 0.5_0.9',
    //         true_value: 0.7928,
    //         ascii_art: `|~----------------------------~-         |
    // |.--- -----------------------------------|`,
    //         image_path: 'images/sample_002_0.7928.png'
    //     },
    //     {
    //         type: 'both',
    //         block_name: 'Text + Image, Range 0.5_0.9',
    //         true_value: 0.7395,
    //         ascii_art: `|-=----------------------=----           |
    // |---~--------~---------------------------|`,
    //         image_path: 'images/sample_003_0.7395.png'
    //     },
    //     {
    //         type: 'both',
    //         block_name: 'Text + Image, Range 0.5_0.9',
    //         true_value: 0.5624,
    //         ascii_art: `|-- ---------~---------                  |
    // |--- -----------------------------.------|`,
    //         image_path: 'images/sample_004_0.5624.png'
    //     },
    //     {
    //         type: 'both',
    //         block_name: 'Text + Image, Range 0.5_0.9',
    //         true_value: 0.5624,
    //         ascii_art: `|---------- ---------=-                  |
    // |-- -------------------------------- ----|`,
    //         image_path: 'images/sample_005_0.5624.png'
    //     },
    //     {
    //         type: 'both',
    //         block_name: 'Text + Image, Range 0.5_0.9',
    //         true_value: 0.5232,
    //         ascii_art: `|------~----------- -                    |
    // |--------.---.---------------------------|`,
    //         image_path: 'images/sample_006_0.5232.png'
    //     },
    //     {
    //         type: 'both',
    //         block_name: 'Text + Image, Range 0.5_0.9',
    //         true_value: 0.8465,
    //         ascii_art: `|----------- -------=-------------       |
    // |---------.--- --------------------------|`,
    //         image_path: 'images/sample_007_0.8465.png'
    //     },
    //     {
    //         type: 'both',
    //         block_name: 'Text + Image, Range 0.5_0.9',
    //         true_value: 0.7404,
    //         ascii_art: `|--=-------=------------------           |
    // |--------------------------- ------------|`,
    //         image_path: 'images/sample_008_0.7404.png'
    //     },
    //     {
    //         type: 'both',
    //         block_name: 'Text + Image, Range 0.5_0.9',
    //         true_value: 0.7832,
    //         ascii_art: `|---------=-----------------~---         |
    // |------=------=--------------------------|`,
    //         image_path: 'images/sample_009_0.7832.png'
    //     }
];



/* ================================
   CONFIG — EDIT THESE TWO LINES
   ================================ */
const experimentName = "exp-a";  // e.g., "exp-a", "exp-b"
const endpoint = "https://script.google.com/macros/s/AKfycbyyug9E41eBaOXGC7TxIlpV9WmSwUXqIG4mxi91_WvYOkIA0sGZNmTtTNltcnGAjCXAqA/exec";

/* ================================
   Participant/session metadata
   ================================ */
function genId(prefix) {
    const rnd = Math.random().toString(36).slice(2, 8);
    const t = Date.now().toString(36);
    return `${prefix}-${t}-${rnd}`;
}
const participantId = (localStorage.getItem('participantId') || genId('P'));
localStorage.setItem('participantId', participantId);

const sessionId = (crypto.randomUUID?.() || genId('S'));
const startedAt = new Date().toISOString();
const userAgent = navigator.userAgent;

/* ================================
   DOM refs
   ================================ */
const experimentContainer = document.getElementById('experiment-container');
const stimulusContent = document.getElementById('stimulus-content');
const instructionText = document.getElementById('instruction-text');
const stimulusAscii = document.getElementById('stimulus-ascii');
const stimulusImage = document.getElementById('stimulus-image');
const responseSlider = document.getElementById('response-slider');
const sliderValueDisplay = document.getElementById('slider-value');
const nextButton = document.getElementById('next-button');
const progressIndicator = document.getElementById('progress-indicator');
const stimulusInstruction = document.getElementById('stimulus-instruction');
const backButton = document.getElementById('back-button'); // optional

/* ================================
   State
   ================================ */
let currentStimulusIndex = 0;
let results = [];

/* ================================
   Render a stimulus
   ================================ */
function loadStimulus(index) {
    if (!Array.isArray(stimuli) || !stimuli.length) {
        console.error('No stimuli found. Define `stimuli` before this script.');
        return;
    }
    if (index >= stimuli.length) return;

    const s = stimuli[index];

    // Hide everything
    stimulusContent.style.display = 'none';
    instructionText.style.display = 'none';
    stimulusAscii.style.display = 'none';
    stimulusImage.style.display = 'none';
    responseSlider.style.display = 'none';
    sliderValueDisplay.style.display = 'none';
    stimulusInstruction.style.display = 'none';

    if (s.type === 'instruction') {
        instructionText.textContent = s.text || '';
        instructionText.style.display = 'block';
        nextButton.textContent = 'Continue';
        progressIndicator.textContent = '';
    } else {
        stimulusContent.style.display = 'block';
        stimulusInstruction.style.display = 'block';

        stimulusInstruction.textContent =
            s.type === 'text' ? 'Consider the text-based representation of two lines.' :
                s.type === 'image' ? 'Consider the image-based representation of two lines.' :
                    s.type === 'both' ? 'Consider both the image and text-based representations of two lines.' :
                        '';

        if (s.type === 'text' || s.type === 'both') {
            stimulusAscii.textContent = s.ascii_art || '';
            stimulusAscii.style.display = 'block';
        }
        if (s.type === 'image' || s.type === 'both') {
            stimulusImage.src = s.image_path || '';
            stimulusImage.style.display = 'block';
        }

        responseSlider.value = 0.5;
        sliderValueDisplay.textContent = '0.50';
        responseSlider.style.display = 'block';
        sliderValueDisplay.style.display = 'inline';

        nextButton.textContent = 'Next';
        progressIndicator.textContent = `Stimulus ${index + 1} of ${stimuli.length}`;
    }
}

/* ================================
   Slider live display
   ================================ */
responseSlider.addEventListener('input', () => {
    sliderValueDisplay.textContent = Number(responseSlider.value).toFixed(2);
});

/* ================================
   Next button flow
   ================================ */
nextButton.addEventListener('click', () => {
    const s = stimuli[currentStimulusIndex];
    if (s.type !== 'instruction') {
        results.push({
            participant_id: participantId,
            session_id: sessionId,
            started_at: startedAt,
            experiment: experimentName,
            stimulus_index: currentStimulusIndex,
            type: s.type,
            ascii_art: s.ascii_art || "",
            image_path: s.image_path || "",
            true_value: (s.true_value ?? ""),
            response: Number(responseSlider.value),
            user_agent: userAgent
        });
    }
    currentStimulusIndex++;
    if (currentStimulusIndex < stimuli.length) {
        loadStimulus(currentStimulusIndex);
    } else {
        showCompletion();
    }
});

/* ================================
   Optional back button
   ================================ */
if (backButton) {
    backButton.addEventListener('click', () => {
        if (currentStimulusIndex > 0) {
            currentStimulusIndex--;
            // remove last recorded trial if it was a real trial
            const prev = stimuli[currentStimulusIndex];
            if (prev && prev.type !== 'instruction' && results.length) results.pop();
            loadStimulus(currentStimulusIndex);
        }
    });
}

/* ================================
   Completion screen & send/download
   ================================ */
function buildCSV() {
    const header = [
        "participant_id", "session_id", "started_at", "experiment",
        "stimulus_index", "type", "ascii_art", "image_path", "true_value", "response", "user_agent"
    ];
    let csv = header.join(",") + "\n";
    results.forEach(r => {
        const safe = v => (v == null ? '' : String(v).replace(/"/g, '""'));
        csv += [
            r.participant_id, r.session_id, r.started_at, r.experiment,
            r.stimulus_index, r.type,
            `"${safe(r.ascii_art)}"`,
            r.image_path, r.true_value, r.response,
            `"${safe(r.user_agent)}"`
        ].join(",") + "\n";
    });
    return csv;
}

async function sendCsvThenMaybeDownload() {
    const csv = buildCSV();
    const filename = `results_${experimentName}_${participantId}_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.csv`;

    // send to Apps Script (simple request to avoid preflight)
    let sentOk = false;
    try {
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
                filename,
                csv,
                experimentName,
                participantId,
                sessionId,
                startedAt
            })
        });
        const txt = await res.text();
        console.log('Email submit:', res.status, txt);
        sentOk = res.ok && /"status"\s*:\s*"ok"/.test(txt);
    } catch (e) {
        console.error('Email submit error:', e);
    }

    alert(sentOk ? 'Sent! A local copy will also download.' : 'Send failed. Downloading a local copy instead.');

    // Always give participant a local copy (recommended)
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
}

function showCompletion() {
    experimentContainer.style.display = 'none';
    const done = document.getElementById('completion-screen');
    done.style.display = 'block';

    // Reuse your existing "download-button" as "Send & Download"
    const downloadBtn = document.getElementById('download-button');
    downloadBtn.textContent = 'Send & Download CSV';
    downloadBtn.onclick = () => {
        if (!results.length) { alert('No results to send.'); return; }
        sendCsvThenMaybeDownload();
    };
}

/* ================================
   Start experiment
   ================================ */
document.getElementById('start-button').addEventListener('click', () => {
    document.getElementById('welcome-screen').style.display = 'none';
    experimentContainer.style.display = 'block';
    currentStimulusIndex = 0;
    results = [];
    loadStimulus(currentStimulusIndex);
});
