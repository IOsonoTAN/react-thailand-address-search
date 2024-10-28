import { Meta, StoryFn } from "@storybook/react";
import React from "react";
// import ThailandAddressSearch from "../../dist";
import ThailandAddressSearch from "../components/ThailandAddressSearch";

export default {
  title: "Components/ThailandAddressSearch",
  component: ThailandAddressSearch,
  decorators: [
    (Story) => (
      <div className="p-4 h-screen w-full bg-slate-50">
        <Story />
      </div>
    ),
  ],
} as Meta<typeof ThailandAddressSearch>;

const Template: StoryFn<typeof ThailandAddressSearch> = (args) => {
  return <ThailandAddressSearch {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  onSelectLocation: (location) => console.log("Selected location:", location),
};
Default.parameters = {
  docs: {
    description: {
      story:
        "To see the result of the selected location, please check the console.log output.",
    },
  },
};

export const EnglishLanguage = Template.bind({});
EnglishLanguage.args = {
  ...Default.args,
  language: "en",
};

export const CustomHighlight = Template.bind({});
CustomHighlight.args = {
  ...Default.args,
  highlightColor: "bg-gray-200",
  dropdownSelectedColor: "bg-green-200",
};

export const CustomSearchTermFormat = Template.bind({});
CustomSearchTermFormat.args = {
  ...Default.args,
  searchTermFormat:
    ":districtName 👉 :subdistrictName 👉 :provinceName (:postalCode)",
};

export const CustomSeparator = Template.bind({});
CustomSeparator.args = {
  ...Default.args,
  separator: " > ",
};

export const CustomPlaceholder = Template.bind({});
CustomPlaceholder.args = {
  ...Default.args,
  placeholder: "Input here!",
};

export const CustomMaxResults = Template.bind({});
CustomMaxResults.args = {
  ...Default.args,
  maxResults: 2,
};

export const CustomDisplayFields = Template.bind({});
CustomDisplayFields.args = {
  ...Default.args,
  displayFields: ["subdistrictName", "postalCode"],
  placeholder: "Search for zipcode",
};

export const CustomDropdownSelectedColor = Template.bind({});
CustomDropdownSelectedColor.args = {
  ...Default.args,
  dropdownSelectedColor: "bg-red-200",
};
