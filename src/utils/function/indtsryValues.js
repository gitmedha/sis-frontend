
export function restructureData(data) {
    const result = [];
    data.forEach(item => {
        const { category, industry_name, sub_industry, i_name } = item;

        // Find or create the category entry
        let categoryEntry = result.find(cat => cat.label === category);

        if (!categoryEntry) {
            categoryEntry = {
                label: category,
                children: []
            };
            result.push(categoryEntry);
        }

        // Find or create the industry entry within the category
        // console.log("categoryEntry",categoryEntry);
        let industryEntry = categoryEntry.children.find(ind => ind.label === industry_name);

        if (!industryEntry) {
            industryEntry = {
                label: industry_name,
                value: industry_name,
                children: []
            };
            categoryEntry.children.push(industryEntry);
        }

        // If there's a sub-industry, create an entry for it
        if (sub_industry) {
            let subIndustryEntry = industryEntry.children.find(sub => sub.label === sub_industry);

            if (!subIndustryEntry) {
                subIndustryEntry = {
                    label: sub_industry,
                    value: sub_industry,
                    children: []
                };
                industryEntry.children.push(subIndustryEntry);
            }
        } 
      
    });
    return result;
}


