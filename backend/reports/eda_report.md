# NutriSense — EDA Report (Milestone 2, Day 13)

Rows: 4000, Columns: 29

## Missing values

|              |   % missing |
|:-------------|------------:|
| avg_fiber_g  |        2.82 |
| symptom_mood |        3.3  |


## Target prevalence (class imbalance check)

|                      |   % positive |
|:---------------------|-------------:|
| anemia_risk          |         8    |
| iron_deficiency      |        11.55 |
| vitamin_d_deficiency |        10.85 |
| b12_deficiency       |         6.32 |
| calcium_deficiency   |         3.88 |

_All targets are minority-class (imbalanced) — evaluation uses precision/recall/F1/ROC-AUC per label, not accuracy alone, and models use `class_weight='balanced'` / `scale_pos_weight`._

## Numeric feature summary

|       |     age |     bmi |   avg_kcal |   avg_protein_g |   avg_fiber_g |   avg_iron_mg |   avg_b12_mcg |   avg_calcium_mg |   avg_vitamin_d_iu |
|:------|--------:|--------:|-----------:|----------------:|--------------:|--------------:|--------------:|-----------------:|-------------------:|
| count | 4000    | 4000    |    4000    |         4000    |       3887    |       4000    |       4000    |          4000    |            4000    |
| mean  |   41.55 |   24.08 |    2010.22 |           60.23 |         22.11 |         10.85 |          1.76 |           705.65 |             255.04 |
| std   |   13.86 |    5.39 |     342.81 |           18.09 |          7.95 |          4.03 |          1.28 |           248.17 |             149.59 |
| min   |   18    |   11.3  |    1100    |           20    |          5    |          2    |          0.05 |           150    |              20    |
| 25%   |   29    |   20.2  |    1781    |           47.7  |         16.6  |          8.07 |          0.76 |           534    |             138.75 |
| 50%   |   41    |   23.7  |    2014    |           60.2  |         22    |         10.7  |          1.57 |           699.5  |             244.5  |
| 75%   |   54    |   27.6  |    2234    |           72.6  |         27.5  |         13.5  |          2.46 |           877    |             355    |
| max   |   65    |   46    |    3165    |          126.3  |         51.8  |         26.7  |          7.17 |          1800    |             882    |


## Diet preference vs deficiency rate

| dietary_preference   |   anemia_risk |   iron_deficiency |   vitamin_d_deficiency |   b12_deficiency |   calcium_deficiency |
|:---------------------|--------------:|------------------:|-----------------------:|-----------------:|---------------------:|
| Eggetarian           |           7.4 |              10.8 |                   12.3 |              7.1 |                  2   |
| Non-Vegetarian       |           6.6 |               8.5 |                    8.9 |              3   |                  3.5 |
| Vegan                |          10.6 |              17.7 |                   13.9 |             13.4 |                  9.8 |
| Vegetarian           |           8.6 |              12.5 |                   11   |              6.7 |                  3.3 |

